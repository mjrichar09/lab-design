#!/usr/bin/env python3
"""Compute weighted walking distance (a From-To travel chart) for a layout.

Reads station coordinates directly from a layout HTML file's `items` array
and the workflow activities/steps, normalizes every activity to trips-per-day,
and reports total walked feet per day plus the highest-traffic legs.

Usage:
    python3 compute_walking_distance.py ../layouts/upstream_lab_layout.html v2
    python3 compute_walking_distance.py ../layouts/upstream_lab_layout.html v3

The layout file holds both arrangements as presets (const ITEMS_V2 / ITEMS_V3);
the second arg picks one (default v2). An exported single-layout file (which
carries a plain `let items = [...]`) also works with no preset arg.

Distances are straight-line (centroid-to-centroid), a first-pass approximation
appropriate for a fairly open room. Add obstacle-aware routing later if it
changes which layout wins.
"""
import re, json, math, sys
from collections import defaultdict

# custom* ids in the layout map to these friendly ids (see station_reference.csv)
RENAME = {'custom1':'scale1000','custom2':'scale500','custom3':'scale150',
          'custom4':'bench','custom5':'rocker1','custom6':'rocker2',
          'custom7':'rocker3','custom8':'manifold','custom9':'shelf1'}

# --- production cadence (from run_cadence_template.csv) ---
RUNS_PER_MONTH = 3
RUNS_PER_DAY = RUNS_PER_MONTH / 30.4

# --- activities: (ordered station sequence, trips_per_day, people_per_trip) ---
# Sequences are built from the free-text narratives in activities_template.csv.
# 'fridge' is the dedicated media refrigerator (added to the layouts in the prep
# cluster). NOTE: bioreactor/rocker targets are assumed where the narrative is
# ambiguous. Adjust here as the workflow data is refined.
def activities():
    a = {}
    for br in ['sartorius500', '200L-a', '50L-a']:          # daily sampling, per active reactor
        a[f'daily_sampling[{br}]'] = ([br, 'islandA', 'datastation', br], 2.0, 1)
    a['harvest_to_centrifuge'] = (['sartorius500', 'harvest10', 'scale1000', 'centrifuge'], RUNS_PER_DAY, 2)
    a['passage_shake_flask']   = (['incubator', 'fridge', 'bsc', 'islandA', 'datastation', 'bsc', 'incubator', 'fridge'], 2/7, 1)
    a['inoculate_rocker']      = (['incubator', 'fridge', 'bsc', 'islandA', 'datastation', 'bsc', 'rocker1'], RUNS_PER_DAY, 1)
    a['inoculate_bioreactor']  = (['rocker1', 'islandA', 'datastation', '50L-a'], RUNS_PER_DAY, 2)
    return a

def load_centroids(path, preset='v2'):
    html = open(path).read()
    m = re.search(r'const ITEMS_' + preset.upper() + r'\s*=\s*(\[.*?\n\]);', html, re.S)
    if not m:                                    # exported/legacy single-layout file
        m = re.search(r'let items\s*=\s*(\[.*?\n\]);', html, re.S)
    items = json.loads(m.group(1))
    c = {}
    for it in items:
        sid = RENAME.get(it['id'], it['id'])
        c[sid] = (it['x'] + it['w']/2, it['y'] + it['h']/2)
    return c

def main(path, preset='v2'):
    C = load_centroids(path, preset)
    d = lambda a, b: math.dist(C[a], C[b])
    pathlen = lambda seq: sum(d(seq[i], seq[i+1]) for i in range(len(seq)-1))
    acts = activities()

    print(f"Layout: {path} [preset: {preset}]\n")
    print(f"{'activity':30s} {'trips/day':>9s} {'ppl':>3s} {'ft/trip':>8s} {'ft/day':>8s}")
    total = 0
    pair = defaultdict(float)
    for name, (seq, tpd, ppl) in acts.items():
        dist = pathlen(seq); ftday = dist * tpd * ppl; total += ftday
        print(f"{name:30s} {tpd:9.3f} {ppl:3d} {dist:8.1f} {ftday:8.1f}")
        for i in range(len(seq)-1):
            pair[tuple(sorted((seq[i], seq[i+1])))] += d(seq[i], seq[i+1]) * tpd * ppl
    print(f"{'TOTAL':30s} {'':9s} {'':3s} {'':8s} {total:8.1f}\n")
    print("Top weighted legs (ft/day on that segment):")
    for (a, b), v in sorted(pair.items(), key=lambda x: -x[1])[:10]:
        print(f"  {a:14s} <-> {b:14s} {v:7.1f}   (leg {d(a,b):.1f} ft)")

if __name__ == '__main__':
    path = sys.argv[1] if len(sys.argv) > 1 else '../layouts/upstream_lab_layout.html'
    preset = sys.argv[2] if len(sys.argv) > 2 else 'v2'
    main(path, preset)

#!/usr/bin/env python3
"""
Simple zero-dependency bundler for Wucius Wong 2D Design Studio.
Concatenates ES modules into a clean standalone js/bundle.js that runs
flawlessly on both http:// and file:/// protocols (no CORS issues).
"""
import re
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def build():
    js_dir = os.path.join(BASE_DIR, 'js')
    
    with open(os.path.join(js_dir, 'canvas-utils.js')) as f:
        c_utils = f.read().replace('export const CanvasUtils =', 'const CanvasUtils =')

    with open(os.path.join(js_dir, 'data', 'chapters-content.js')) as f:
        c_content = f.read().replace('export const chaptersContent =', 'const chaptersContent =')

    with open(os.path.join(js_dir, 'data', 'study-cards-data.js')) as f:
        c_cards = f.read().replace('export const studyCardsData =', 'const studyCardsData =')

    with open(os.path.join(js_dir, 'data', 'real-world-data.js')) as f:
        c_real_cases = f.read().replace('export const realWorldCases =', 'const realWorldCases =')

    with open(os.path.join(js_dir, 'real-world', 'real-world-renderer.js')) as f:
        c_rw_renderer = f.read().replace('export const RealWorldRenderer =', 'const RealWorldRenderer =')

    with open(os.path.join(js_dir, 'studio', 'shapes.js')) as f:
        c_shapes = f.read().replace('export const Shapes =', 'const Shapes =')

    with open(os.path.join(js_dir, 'studio', 'studio-engine.js')) as f:
        c_engine = f.read()
        c_engine = c_engine.replace("import { Shapes } from './shapes.js';", '')
        c_engine = c_engine.replace("import { CanvasUtils } from '../canvas-utils.js';", '')
        c_engine = c_engine.replace('export const defaultStudioState =', 'const defaultStudioState =')
        c_engine = c_engine.replace('export class StudioEngine', 'class StudioEngine')

    chapters_code = []
    chapter_names = [
        (1, 'introduction'), (2, 'form'), (3, 'repetition'), (4, 'structure'),
        (5, 'similarity'), (6, 'gradation'), (7, 'radiation'), (8, 'anomaly'),
        (9, 'contrast'), (10, 'concentration'), (11, 'texture'), (12, 'space')
    ]
    for i, name in chapter_names:
        with open(os.path.join(js_dir, 'chapters', f'ch{i}-{name}.js')) as f:
            txt = f.read()
            txt = txt.replace("import { CanvasUtils } from '../canvas-utils.js';", '')
            txt = txt.replace(f'export const Chapter{i} =', f'const Chapter{i} =')
            chapters_code.append(txt)

    with open(os.path.join(js_dir, 'app.js')) as f:
        c_app = f.read()
        c_app = re.sub(r'import\s+.*?;', '', c_app)

    bundle = f"""// Standalone self-contained script for Wucius Wong 2D Design Studio
// Compatible with both http:// (web server) and file:/// (local direct open)
(function() {{
  'use strict';

  {c_utils}

  {c_content}

  {c_cards}

  {c_real_cases}

  {c_rw_renderer}

  {c_shapes}

  {c_engine}

  {''.join(chapters_code)}

  {c_app}

  if (typeof window !== 'undefined') {{
    window.StudioEngine = StudioEngine;
    window.WongApp = WongApp;
  }}
}})();
"""

    bundle_path = os.path.join(js_dir, 'bundle.js')
    with open(bundle_path, 'w') as f:
        f.write(bundle)

    print(f"Built {bundle_path} successfully ({len(bundle):,} bytes)")

if __name__ == '__main__':
    build()

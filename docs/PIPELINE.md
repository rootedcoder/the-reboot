# THE REBOOT — Content Pipeline

## Overview
The content pipeline is an internal tool — invisible to users. It produces the BoneKeyframe JSON animation data that the app consumes. It also handles AI-assisted skill structure generation.

## Why a Pipeline?
Instead of manually animating every exercise or skill technique in Blender (which doesn't scale), the pipeline processes any human movement demonstration video from anywhere in the world and converts it into structured, reusable animation data.

Add a new skill to the DB → find a demonstration video → run the pipeline → animation is in the app.

---

## Animation Sources

| Source | Used For | Notes |
|---|---|---|
| **Mixamo** | Standard gym exercises | Hundreds already MoCapped, free for commercial use |
| **CMU Motion Capture DB** | Additional movements | Academic, free, BVH format |
| **Demonstration videos** | Traditional skills, unique exercises | Any video of human movement |
| **Manual keyframing** | Edge cases, corrections | Blender direct editing |

---

## Video to Keyframe Flow

```
1. Source video found (YouTube, training footage, demonstration videos)
          ↓
2. Run through pose estimation
   - MediaPipe: fast, good for clear single-person footage
   - WHAM: better for complex movements, occlusion handling
          ↓
3. 3D joint positions extracted per frame
   - Output: (x, y, z) per joint per frame
          ↓
4. Joints mapped to rig bone names (Python script)
   - Input: MediaPipe/WHAM joint names
   - Output: Mixamo bone name convention
          ↓
5. Keyframe data cleaned and smoothed
   - Remove noise from pose estimation
   - Smooth curves (Gaussian or Savitzky-Golay filter)
   - Normalize to 30fps
          ↓
6. Previewed in Three.js browser viewer (admin tool)
          ↓
7. Dev reviews — approves or requests cleanup
          ↓
8. JSON saved to Supabase animation_data table
          ↓
9. Available in app immediately
```

---

## Legal Note
Joint position and rotation data extracted from videos is not copyrightable — it is mathematical data describing human movement. The video is copyrighted, the movement data is not. Extracting pose data from publicly available demonstration videos is legally clean.

---

## BoneKeyframe JSON Format

```json
{
  "id": "pushup_standard",
  "type": "exercise",
  "name": "Push-up",
  "loop": true,
  "loop_start_frame": 0,
  "highlight_meshes": ["PectoralisMajor", "Triceps", "AnteriorDeltoid"],
  "highlight_bones": ["LeftArm", "RightArm", "LeftForeArm", "RightForeArm"],
  "source": "mixamo",
  "source_ref": "https://mixamo.com/...",
  "keyframes": [
    {
      "frame": 0,
      "timestamp": 0,
      "label": "Top Position",
      "bones": {
        "Hips": { "rotation": { "x": 0, "y": 0, "z": 0 }, "position": { "x": 0, "y": 1.0, "z": 0 } },
        "LeftArm": { "rotation": { "x": 0, "y": 0, "z": -45 } },
        "RightArm": { "rotation": { "x": 0, "y": 0, "z": 45 } },
        "LeftForeArm": { "rotation": { "x": 0, "y": 0, "z": 0 } },
        "RightForeArm": { "rotation": { "x": 0, "y": 0, "z": 0 } }
      }
    },
    {
      "frame": 30,
      "timestamp": 1000,
      "label": "Bottom Position",
      "bones": {
        "Hips": { "rotation": { "x": 0, "y": 0, "z": 0 }, "position": { "x": 0, "y": 0.3, "z": 0 } },
        "LeftArm": { "rotation": { "x": 0, "y": 0, "z": -80 } },
        "RightArm": { "rotation": { "x": 0, "y": 0, "z": 80 } },
        "LeftForeArm": { "rotation": { "x": 90, "y": 0, "z": 0 } },
        "RightForeArm": { "rotation": { "x": 90, "y": 0, "z": 0 } }
      }
    }
  ]
}
```

---

## Technique Step-by-Step Format

For skill techniques — animation pauses so user can study form at key positions.

```json
{
  "id": "silambam_basic_stance",
  "type": "technique",
  "name": "Silambam Basic Stance",
  "loop": false,
  "step_by_step": true,
  "pause_at_frames": [0, 30, 60, 90],
  "step_labels": [
    { "frame": 0, "label": "Starting Position", "description": "Stand with feet shoulder-width apart, weight balanced equally." },
    { "frame": 30, "label": "Lower Stance", "description": "Bend knees to 45 degrees. Keep spine straight. Weight slightly forward." },
    { "frame": 60, "label": "Guard Position", "description": "Raise staff to chest height. Both hands grip firmly, dominant hand leads." },
    { "frame": 90, "label": "Ready", "description": "Eyes forward. Body balanced. Ready to move in any direction." }
  ],
  "highlight_meshes": ["Quadriceps", "Calves", "CoreMuscles"],
  "keyframes": [ ... ]
}
```

---

## Bone Naming Convention (Mixamo Standard)
Both male and female models use identical bone names. Same JSON drives both.

```
Hips
├── Spine
│   ├── Spine1
│   │   ├── Spine2
│   │   │   ├── Neck
│   │   │   │   └── Head
│   │   │   ├── LeftShoulder
│   │   │   │   └── LeftArm
│   │   │   │       └── LeftForeArm
│   │   │   │           └── LeftHand
│   │   │   └── RightShoulder
│   │   │       └── RightArm
│   │   │           └── RightForeArm
│   │   │               └── RightHand
├── LeftUpLeg
│   └── LeftLeg
│       └── LeftFoot
│           └── LeftToeBase
└── RightUpLeg
    └── RightLeg
        └── RightFoot
            └── RightToeBase
```

---

## Muscle Mesh Names (for highlight_meshes)
```
Upper Body:
  PectoralisMajor, PectoralisMinor
  LatissimusDorsi, Rhomboids, TrapeziusUpper, TrapeziusLower
  AnteriorDeltoid, LateralDeltoid, PosteriorDeltoid
  Biceps, Triceps, Brachialis
  ForearmFlexors, ForearmExtensors
  CoreMuscles, Obliques, TransverseAbdominis

Lower Body:
  Quadriceps, Hamstrings, GluteusMaximus, GluteusMedius
  Calves, Soleus, TibialisAnterior
  HipFlexors, Adductors, Abductors
```

---

## AI Skill Generation Flow

```
1. User searches for a skill not in the database
          ↓
2. App creates SkillGenerationJob in Supabase (status: 'pending')
          ↓
3. Supabase Edge Function triggers OpenAI
   Prompt: Generate complete Skill structure for [skill name]
   Output: Full Skill JSON (name, origin, levels, techniques, mastery requirements)
          ↓
4. AI output saved to skill_generation_jobs.ai_generated_data
   Status → 'review'
          ↓
5. Dev reviews in admin tool
   - Check AI accuracy for the specific cultural/martial art
   - Edit if needed
   - Approve → Status → 'approved'
          ↓
6. Animation pipeline runs for each technique in the skill
          ↓
7. Skill published — skills.is_published = true
          ↓
8. Available to all users immediately via React Query
```

**Key:** AI runs ONCE per skill, not per user request. Output is permanent DB data.

---

## Admin Tool (Next.js)

Screens needed:
- **Pipeline queue** — list of jobs, input/output, status, preview 3D in browser
- **Skill review** — AI-generated skill data, edit fields, approve/reject
- **Exercise library** — browse, edit, add grade scaling
- **Benchmark data** — edit grade ranges per stat per gender
- **App config** — edit AppConfig table values
- **Analytics** — skill request volume, AI cost tracking

---

## Development Environment Setup (Pipeline)

```bash
# Python environment
python -m venv pipeline-env
pip install mediapipe wham-estimation numpy scipy

# Blender (for manual cleanup)
# Blender 4.x with Python API access

# Admin tool
cd admin/
npm install
# Requires Supabase service role key (not the anon key)
```

# THE REBOOT — Database Schema (Supabase / PostgreSQL)

## Design Principles
- All lists are DB-driven — no hardcoded enums in application code
- AppConfig table controls all behavioral values — no code deploy for config changes
- Row-Level Security (RLS) on all user tables
- Content tables (stats, exercises, skills) are public read, admin write only
- User tables are private — users can only access their own rows

---

## Tables

### `app_config`
Controls all app behavior without code changes.
```sql
key         text PRIMARY KEY
value       text NOT NULL
description text
updated_at  timestamptz DEFAULT now()
```
**Seed values:**
```
free_tier_max_active_stats     = '3'
free_tier_max_skills           = '1'
trial_duration_days            = '14'
reassessment_interval_days     = '28'
max_ai_skills_per_month        = '50'
min_app_version                = '1.0.0'
```

---

### `stats` (content — public read)
The 10 core stats. Expandable by inserting rows.
```sql
id            text PRIMARY KEY        -- e.g. 'strength', 'stamina'
name          text NOT NULL
description   text
icon          text                    -- icon name reference
related_body_parts  text[]
display_order int DEFAULT 0
is_active     bool DEFAULT true
created_at    timestamptz DEFAULT now()
```

### `benchmark_tests` (content — public read)
Multiple tests per stat. Average of all tests = stat score.
```sql
id                  text PRIMARY KEY  -- e.g. 'strength_pullups'
stat_id             text REFERENCES stats(id)
name                text NOT NULL
description         text
unit                text NOT NULL     -- 'reps', 'seconds', 'cm', 'km'
instructions        text
equipment_needed    text[]
animation_ref       text              -- exercise ID for demo animation
display_order       int DEFAULT 0
```

### `benchmark_ranges` (content — public read)
Grade thresholds per test per gender.
```sql
id          uuid DEFAULT gen_random_uuid() PRIMARY KEY
test_id     text REFERENCES benchmark_tests(id)
gender      text CHECK (gender IN ('male', 'female', 'neutral'))
grade       text CHECK (grade IN ('S','A','B','C','D','E','F'))
min_value   numeric NOT NULL
max_value   numeric
score       int NOT NULL              -- normalized 0-100 for this grade
```

---

### `users` (private — RLS: users see own row only)
```sql
id              uuid PRIMARY KEY REFERENCES auth.users(id)
name            text
email           text
avatar_url      text
gender          text CHECK (gender IN ('male','female','neutral'))
auth_provider   text
units_weight    text DEFAULT 'kg'
units_distance  text DEFAULT 'km'
created_at      timestamptz DEFAULT now()
last_active_at  timestamptz DEFAULT now()
```

### `user_subscriptions` (private — RLS)
```sql
id              uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id         uuid REFERENCES users(id)
tier            text CHECK (tier IN ('free','trial','monthly','yearly'))
start_date      timestamptz
end_date        timestamptz
is_active       bool DEFAULT true
revenuecat_id   text
updated_at      timestamptz DEFAULT now()
```

### `user_stat_profiles` (private — RLS)
One row per user per stat (10 rows per user).
```sql
id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id             uuid REFERENCES users(id)
stat_id             text REFERENCES stats(id)
current_grade       text
current_score       numeric
target_grade        text
is_active_improvement bool DEFAULT false  -- free tier: max 3 true
last_assessed_at    timestamptz
updated_at          timestamptz DEFAULT now()
UNIQUE(user_id, stat_id)
```

### `user_benchmark_results` (private — RLS)
Individual test results over time.
```sql
id          uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id     uuid REFERENCES users(id)
test_id     text REFERENCES benchmark_tests(id)
value       numeric NOT NULL
score       int NOT NULL
recorded_at timestamptz DEFAULT now()
session_id  uuid                          -- links to assessment_sessions
```

### `user_grade_history` (private — RLS)
Grade changes over time per stat.
```sql
id          uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id     uuid REFERENCES users(id)
stat_id     text REFERENCES stats(id)
grade       text NOT NULL
score       numeric NOT NULL
date        timestamptz DEFAULT now()
```

### `user_overall_grades` (private — RLS)
```sql
id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id             uuid REFERENCES users(id) UNIQUE
overall_grade       text NOT NULL
overall_score       numeric NOT NULL
level               int NOT NULL DEFAULT 1
xp                  int NOT NULL DEFAULT 0
xp_to_next_level    int NOT NULL DEFAULT 1000
stat_breakdown      jsonb                 -- { statId: { grade, score } }
updated_at          timestamptz DEFAULT now()
```

---

### `skill_categories` (content — public read)
```sql
id            text PRIMARY KEY        -- e.g. 'martial_arts_modern'
name          text NOT NULL
description   text
icon          text
display_order int DEFAULT 0
```

### `skills` (content — public read, isPublished filter)
```sql
id            text PRIMARY KEY
name          text NOT NULL
origin        text                    -- country/region of origin
category_id   text REFERENCES skill_categories(id)
description   text
difficulty    text CHECK (difficulty IN ('beginner','intermediate','advanced','elite'))
related_stats text[]                  -- stat ids
source        text CHECK (source IN ('curated','ai_generated'))
is_published  bool DEFAULT false
created_at    timestamptz DEFAULT now()
updated_at    timestamptz DEFAULT now()
```

### `skill_levels` (content — public read)
```sql
id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY
skill_id              text REFERENCES skills(id)
level                 int NOT NULL
name                  text NOT NULL
description           text
mastery_requirements  jsonb   -- { minStatGrades, techniquesCompleted, minimumTrainingSessions }
display_order         int DEFAULT 0
UNIQUE(skill_id, level)
```

### `techniques` (content — public read)
```sql
id              text PRIMARY KEY
skill_id        text REFERENCES skills(id)
skill_level     int NOT NULL
name            text NOT NULL
description     text
instructions    text
common_mistakes text[]
tips            text[]
animation_id    text                  -- references animation_data(id)
display_order   int DEFAULT 0
```

### `user_skills` (private — RLS)
```sql
id              uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id         uuid REFERENCES users(id)
skill_id        text REFERENCES skills(id)
current_level   int DEFAULT 1
xp              int DEFAULT 0
last_trained_at timestamptz
added_at        timestamptz DEFAULT now()
UNIQUE(user_id, skill_id)
```

---

### `exercises` (content — public read)
```sql
id                text PRIMARY KEY
name              text NOT NULL
description       text
primary_muscles   text[]
secondary_muscles text[]
related_stats     text[]
difficulty        text
equipment_needed  text[]
instructions      text
tags              text[]
related_skills    text[]
animation_id      text                -- references animation_data(id)
is_active         bool DEFAULT true
created_at        timestamptz DEFAULT now()
```

### `exercise_grade_scaling` (content — public read)
```sql
id        uuid DEFAULT gen_random_uuid() PRIMARY KEY
exercise_id text REFERENCES exercises(id)
grade       text
sets        int
reps        text                      -- '8-10' or '8' or 'max'
rest        int                       -- seconds
notes       text
```

---

### `animation_data` (content — public read)
The core of the 3D system. BoneKeyframe JSON drives both male and female models.
```sql
id              text PRIMARY KEY
type            text CHECK (type IN ('exercise','technique'))
name            text NOT NULL
keyframes       jsonb NOT NULL        -- BoneKeyframe[]
loop            bool DEFAULT true
loop_start_frame int DEFAULT 0
pause_at_frames int[]                 -- for step-by-step technique mode
step_labels     jsonb                 -- [{ frame, label, description }]
highlight_bones text[]
highlight_meshes text[]               -- muscle group meshes to color
source          text                  -- 'mixamo','cmu','pose_estimated','manual'
source_ref      text
created_at      timestamptz DEFAULT now()
```

---

### `routines` (private — RLS)
```sql
id            uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id       uuid REFERENCES users(id)
name          text NOT NULL
description   text
source        text CHECK (source IN ('manual','grade_target','body_selection','skill_training'))
target_stats  text[]
target_skills text[]
is_active     bool DEFAULT true
created_at    timestamptz DEFAULT now()
```

### `routine_days` (private — RLS)
```sql
id          uuid DEFAULT gen_random_uuid() PRIMARY KEY
routine_id  uuid REFERENCES routines(id) ON DELETE CASCADE
day_of_week int                       -- 0=Mon, 6=Sun
exercises   jsonb                     -- [{ exerciseId, sets, reps, rest, order }]
```

### `workout_sessions` (private — RLS)
```sql
id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id               uuid REFERENCES users(id)
routine_id            uuid
source                text
exercises             jsonb           -- SessionExercise[]
started_at            timestamptz DEFAULT now()
completed_at          timestamptz
duration_minutes      int
xp_earned             int DEFAULT 0
stat_progress_updates jsonb           -- [{ statId, prevScore, newScore }]
skill_progress_updates jsonb          -- [{ skillId, prevLevel, newLevel }]
```

### `assessment_sessions` (private — RLS)
```sql
id              uuid DEFAULT gen_random_uuid() PRIMARY KEY
user_id         uuid REFERENCES users(id)
type            text CHECK (type IN ('full','partial'))
trigger         text CHECK (trigger IN ('onboarding','scheduled','skill_level_up','manual'))
stats_assessed  text[]
results         jsonb                 -- [{ statId, testResults[], finalScore, grade, previousGrade }]
completed_at    timestamptz DEFAULT now()
```

---

### `pipeline_jobs` (internal — admin only)
```sql
id                      uuid DEFAULT gen_random_uuid() PRIMARY KEY
type                    text CHECK (type IN ('exercise','technique','skill'))
input_type              text
input_ref               text
status                  text CHECK (status IN ('pending','processing','review','approved','rejected'))
pose_estimation_engine  text
extracted_keyframes     jsonb
cleaned_keyframes       jsonb
preview_url             text
review_notes            text
target_exercise_id      text
target_technique_id     text
created_at              timestamptz DEFAULT now()
completed_at            timestamptz
```

### `skill_generation_jobs` (internal — admin only)
```sql
id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY
requested_skill_name  text NOT NULL
requested_by          uuid REFERENCES users(id)
ai_generated_data     jsonb
status                text CHECK (status IN ('pending','review','approved','rejected'))
review_notes          text
pipeline_job_ids      uuid[]
published_skill_id    text
created_at            timestamptz DEFAULT now()
published_at          timestamptz
```

---

## RLS Policies Summary

```sql
-- Users can only read/write their own rows
CREATE POLICY "user_own" ON user_stat_profiles
  USING (user_id = auth.uid());

-- Content tables are public read
CREATE POLICY "public_read" ON stats
  FOR SELECT USING (true);

-- Pipeline jobs are admin only
CREATE POLICY "admin_only" ON pipeline_jobs
  USING (auth.jwt() ->> 'role' = 'admin');
```

## Indexes
```sql
CREATE INDEX ON user_stat_profiles(user_id);
CREATE INDEX ON user_benchmark_results(user_id, test_id);
CREATE INDEX ON user_grade_history(user_id, stat_id);
CREATE INDEX ON workout_sessions(user_id, started_at DESC);
CREATE INDEX ON skills(category_id, is_published);
CREATE INDEX ON exercises(difficulty, is_active);
```

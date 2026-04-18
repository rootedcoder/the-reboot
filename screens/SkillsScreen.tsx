import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SystemCard } from '../components/SystemCard';
import { useAppStore } from '../store/useAppStore';
import { AssessmentModal } from '../components/AssessmentModal';

export function SkillsScreen() {
  const { skills, addSkill, gainSkillXp, assessSkill } = useAppStore((s) => s);
  const [newSkill, setNewSkill] = useState('');
  const [activeSkillId, setActiveSkillId] = useState<string | undefined>(undefined);
  const [result, setResult] = useState('');

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <SystemCard title="Skill Tree">
          {skills.map((skill) => (
            <View key={skill.id} style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.name}>{skill.name}</Text>
                <Text style={styles.meta}>Lv.{skill.level} · XP {skill.xp}</Text>
                {skill.readyForAssessment ? <Text style={styles.ready}>Assessment Available</Text> : null}
              </View>
              <View>
                <PrimaryButton label="Train +30" onPress={() => gainSkillXp(skill.id, 30)} style={styles.trainBtn} />
                {skill.readyForAssessment ? (
                  <PrimaryButton label="Assess" onPress={() => setActiveSkillId(skill.id)} style={styles.assessBtn} />
                ) : null}
              </View>
            </View>
          ))}
          {!!result && <Text style={styles.result}>{result}</Text>}
        </SystemCard>

        <SystemCard title="Unlock New Skill">
          <TextInput
            placeholder="Custom skill name"
            placeholderTextColor="#6b7280"
            value={newSkill}
            onChangeText={setNewSkill}
            style={styles.input}
          />
          <PrimaryButton
            label="Add Skill"
            onPress={() => {
              if (!newSkill.trim()) return;
              addSkill(newSkill.trim());
              setNewSkill('');
            }}
          />
        </SystemCard>
      </ScrollView>

      <AssessmentModal
        visible={!!activeSkillId}
        title="Skill Assessment"
        onClose={() => setActiveSkillId(undefined)}
        onSubmit={(payload) => {
          if (!activeSkillId) return;
          const response = assessSkill(activeSkillId, payload);
          setResult(response.message);
          setActiveSkillId(undefined);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  content: { padding: 16, paddingBottom: 40 },
  row: {
    borderBottomColor: '#1f2937',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  name: { color: '#fff', fontWeight: '700' },
  meta: { color: '#9ca3af', fontSize: 12, marginTop: 3 },
  ready: { color: '#facc15', fontSize: 12, marginTop: 4, fontWeight: '700' },
  trainBtn: { paddingHorizontal: 12, minHeight: 40, marginTop: 8 },
  assessBtn: { paddingHorizontal: 12, minHeight: 40, marginTop: 6, backgroundColor: '#0f766e' },
  result: { color: '#f8fafc', fontWeight: '700', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    color: '#fff',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#0b1220',
  },
});

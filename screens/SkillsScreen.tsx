import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { SystemCard } from '../components/SystemCard';
import { useAppStore } from '../store/useAppStore';

export function SkillsScreen() {
  const { skills, addSkill, gainSkillXp } = useAppStore((s) => s);
  const [newSkill, setNewSkill] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SystemCard title="Skill Tree">
        {skills.map((skill) => (
          <View key={skill.id} style={styles.row}>
            <View>
              <Text style={styles.name}>{skill.name}</Text>
              <Text style={styles.meta}>Lv.{skill.level} · XP {skill.xp}</Text>
            </View>
            <PrimaryButton label="Train +30" onPress={() => gainSkillXp(skill.id, 30)} style={styles.trainBtn} />
          </View>
        ))}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  content: { padding: 16, paddingBottom: 40 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#1f2937',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  name: { color: '#fff', fontWeight: '700' },
  meta: { color: '#9ca3af', fontSize: 12, marginTop: 3 },
  trainBtn: { paddingHorizontal: 12, minHeight: 40 },
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

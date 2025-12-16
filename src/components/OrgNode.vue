<template>
  <div class="org-node my-4">
    <v-card class="pa-4" width="280" elevation="8" outlined rounded hover>
      <!-- Avatar -->
      <div class="text-center mb-4">
        <v-avatar size="80" color="grey lighten-3">
          <v-img v-if="node.avatar" :src="node.avatar" alt="Avatar" />
          <span v-else class="text-h4 white--text">
            {{ initials }}
          </span>
        </v-avatar>
      </div>

      <!-- Name + Lead Badge + Subordinate Count -->
      <v-card-title class="text-subtitle-1 font-weight-bold justify-center pb-2">
        {{ node.name }}
        <v-chip
          v-if="isHead"
          small
          color="primary"
          text-color="white"
          class="ml-2 font-weight-bold"
        >
          Lead
        </v-chip>
        <v-badge
          v-if="subordinateCount > 0"
          color="green"
          :content="subordinateCount"
          class="ml-2"
          overlap
        >
          <v-icon small color="green darken-2">mdi-account-multiple-outline</v-icon>
        </v-badge>
      </v-card-title>

      <v-card-subtitle class="text-center py-1">
        {{ node.position }}
      </v-card-subtitle>

      <v-card-text class="text-center text-caption py-2">
        <div v-if="node.experience" class="font-weight-medium">
          Exp: {{ node.experience }}
        </div>
        <div v-if="node.languages" class="grey--text text--darken-1">
          {{ node.languages }}
        </div>
      </v-card-text>

      <v-card-actions class="justify-center pt-3">
        <v-btn icon small @click="$emit('edit', node)" title="Edit">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon small @click="$emit('delete', node)" title="Delete">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'OrgNode',
  props: {
    node: { type: Object, required: true }
  },
  computed: {
    initials() {
      if (!this.node.name) return '';
      return this.node.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
    isHead() {
      const title = (this.node.position || '').toLowerCase();
      return title.includes('head') || title.includes('director') || title.includes('lead') || title.includes('chief');
    },
    subordinateCount() {
      // Total subordinates (count includes self, so subtract 1)
      return (this.node.count || 1) - 1;
    }
  }
}
</script>

<style scoped>
.org-node {
  transition: transform 0.2s ease;
}
.org-node:hover {
  transform: translateY(-4px);
}
.v-card:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}
</style>
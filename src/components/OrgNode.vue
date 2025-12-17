<template>
  <div class="org-node my-3 my-sm-4">
    <v-card
      class="pa-3 pa-sm-4 mx-auto"
      :width="$vuetify.display.xs ? '100%' : '280'"
      max-width="320"
      elevation="8"
      outlined
      rounded="xl"
      hover
      @click="showDetails(node)"
      style="cursor: pointer;"
    >
      <!-- Avatar -->
      <div class="text-center mb-3 mb-sm-4">
        <v-avatar
          :size="$vuetify.display.xs ? 70 : 80"
          color="grey lighten-3"
          class="elevation-4"
        >
          <v-img
            v-if="node.avatar"
            :src="node.avatar"
            alt="Avatar"
            cover
          />
          <span v-else class="text-h5 text-sm-h4 white--text font-weight-bold">
            {{ initials }}
          </span>
        </v-avatar>
      </div>

      <!-- Name + Badges -->
      <v-card-title
        class="text-subtitle-2 text-sm-subtitle-1 font-weight-bold justify-center pb-1 flex-wrap text-center"
      >
        <span class="d-block">{{ node.name }}</span>

        <!-- Lead Badge -->
        <v-chip
          v-if="isHead"
          small
          color="primary"
          text-color="white"
          class="ml-2 mt-1 font-weight-bold"
        >
          Lead
        </v-chip>

        <!-- Subordinates Count Badge -->
        <v-badge
          v-if="subordinateCount > 0"
          color="green"
          :content="subordinateCount"
          overlap
          class="ml-2 mt-1"
        >
          <v-icon small color="green darken-2">
            mdi-account-multiple-outline
          </v-icon>
        </v-badge>
      </v-card-title>

      <!-- Position -->
      <v-card-subtitle class="text-center py-1 text-caption text-sm-body-2">
        {{ node.position }}
      </v-card-subtitle>

      <!-- Details Text -->
      <v-card-text class="text-center text-caption py-2">
        <div v-if="node.experience" class="font-weight-medium">
          Exp: {{ node.experience }}
        </div>
        <div v-if="node.languages" class="grey--text text--darken-2 mt-1">
          {{ node.languages }}
        </div>
      </v-card-text>

      <!-- Action Buttons -->
      <v-card-actions class="justify-center pt-2 pb-3">
        <v-btn
          icon
          small
          @click.stop="$emit('edit', node)"
          title="Edit"
          class="mx-1"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-btn
          icon
          small
          @click.stop="$emit('delete', node)"
          title="Delete"
          class="mx-1"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>

        <v-btn
          icon
          small
          @click.stop="$emit('add-child', node)"
          title="Add Subordinate"
          class="mx-1"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'OrgNode',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  computed: {
    initials() {
      if (!this.node.name) return '';
      return this.node.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },
    isHead() {
      const title = (this.node.position || '').toLowerCase();
      return (
        title.includes('head') ||
        title.includes('director') ||
        title.includes('lead') ||
        title.includes('chief') ||
        title.includes('manager')
      );
    },
    subordinateCount() {
      // count includes self, so subtract 1 to get actual subordinates
      return (this.node.count || 1) - 1;
    }
  },
  methods: {
    showDetails(node) {
      this.$emit('show-details', node);
    }
  }
}
</script>

<style scoped>
.org-node {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.org-node:hover {
  transform: translateY(-6px) scale(1.02);
}

.v-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.v-card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18) !important;
}

/* Responsive text adjustments */
@media (max-width: 599px) {
  .v-card-title {
    font-size: 0.95rem !important;
  }
  .v-card-subtitle {
    font-size: 0.8rem !important;
  }
}

/* Ensure badges don't overflow on small screens */
.v-card-title .v-chip,
.v-card-title .v-badge {
  font-size: 0.7rem;
}
</style>
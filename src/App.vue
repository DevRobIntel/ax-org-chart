<template>
  <v-app :dark="isDarkMode">
    <v-app-bar app color="primary" :dark="!isDarkMode" elevation="4">
      <v-toolbar-title class="text-h6">AX Capital Org Chart Manager</v-toolbar-title>
      <v-spacer />
      <!-- Search Bar -->
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        label="Search Employees"
        class="mx-4"
        hide-details
        clearable
        outlined
        dense
        style="max-width: 300px;"
      />
      <!-- Dark Mode Toggle -->
      <v-switch
        v-model="isDarkMode"
        inset
        :label="isDarkMode ? 'Light Mode' : 'Dark Mode'"
        class="mt-4"
      />
      <v-btn @click="exportData" text>
        <v-icon left>mdi-download</v-icon>
        Export to JSON
      </v-btn>
      <v-btn @click="exportToPDF" text>
        <v-icon left>mdi-file-pdf-box</v-icon>
        Export to PDF
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-0 background-grey">
        <!-- Company Root Card with Total Employee Count -->
        <div class="company-root pa-8 text-center">
          <v-card
            width="600"
            class="mx-auto mb-12 pa-6"
            elevation="15"
            rounded="xl"
            color="accent lighten-4"
          >
            <v-card-title class="text-h4 font-weight-bold justify-center">
              {{ company.name }}
              <v-badge
                color="success"
                :content="totalEmployees"
                class="ml-4"
                bottom
                offset-x="20"
                offset-y="20"
              >
                <v-icon large color="success darken-2">mdi-account-group</v-icon>
              </v-badge>
            </v-card-title>
            <v-card-subtitle class="text-h6">
              Total Employees
            </v-card-subtitle>
            <v-card-actions class="justify-center">
              <v-btn icon @click="openEditDialog(company)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="openAddDialog(company)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>

        <div class="departments-horizontal d-flex overflow-x-auto pa-8" style="gap: 50px;">
          <!-- Filtered Departments -->
          <div
            v-for="dept in filteredDepartments"
            :key="dept.id"
            class="department-column flex-shrink-0 pa-4 rounded-lg"
            style="min-width: 340px; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
          >
            <!-- Department Header with Count and Collapse -->
            <v-card
              class="mb-10 pa-5 text-center"
              width="340"
              elevation="12"
              color="primary lighten-5"
              rounded="xl"
            >
              <v-card-title class="text-h5 font-weight-bold justify-center">
                {{ dept.name }}
                <v-badge
                  color="info"
                  :content="dept.count"
                  class="ml-4"
                  bottom
                  offset-x="20"
                  offset-y="20"
                >
                  <v-icon large color="info darken-2">mdi-account-multiple</v-icon>
                </v-badge>
              </v-card-title>
              <v-card-subtitle class="text-subtitle-1">
                {{ dept.position }}
              </v-card-subtitle>
              <v-card-actions class="justify-center mt-4">
                <v-btn icon @click="dept.expanded = !dept.expanded">
                  <v-icon>{{ dept.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
                <v-btn icon @click="openEditDialog(dept)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteNode(dept)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon @click="openAddDialog(dept)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>

            <!-- Expandable Employees -->
            <v-expand-transition>
              <div v-show="dept.expanded">
                <draggable
                  :list="dept.children"
                  group="org"
                  item-key="id"
                  @end="saveData"
                  class="employees-list"
                  ghost-class="ghost-card"
                >
                  <template #item="{ element }">
                    <div class="employee-wrapper">
                      <org-node
                        :node="element"
                        @edit="openEditDialog"
                        @delete="deleteNode"
                        @add-child="openAddDialog"
                        @update="saveData"
                      />
                    </div>
                  </template>
                </draggable>
              </div>
            </v-expand-transition>
          </div>
        </div>
      </v-container>
    </v-main>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="headline">
          {{ isEdit ? 'Edit' : 'Add New' }} {{ form.position === 'Department' ? 'Department' : 'Employee' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="form.name" label="Name" outlined />
          <v-text-field v-model="form.position" label="Position / Title" outlined />
          <v-text-field v-model="form.experience" label="Experience (e.g. 19 years)" outlined />
          <v-text-field v-model="form.languages" label="Languages" outlined />
          <v-text-field v-model="form.avatar" label="Avatar URL (optional)" outlined />
          <v-text-field v-model="form.managerId" label="Manager ID (for sub-department/team)" outlined />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Employee Details Modal -->
    <v-dialog v-model="detailsDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Employee Details</v-card-title>
        <v-card-text v-if="selectedEmployee">
          <v-avatar size="100" class="mb-4">
            <v-img :src="selectedEmployee.avatar" />
          </v-avatar>
          <p><strong>Name:</strong> {{ selectedEmployee.name }}</p>
          <p><strong>Position:</strong> {{ selectedEmployee.position }}</p>
          <p><strong>Manager:</strong> {{ getManagerName(selectedEmployee.parentId) }}</p>
          <p><strong>Subordinates:</strong> {{ subordinateCount(selectedEmployee) }}</p>
          <p><strong>Experience:</strong> {{ selectedEmployee.experience }}</p>
          <p><strong>Languages:</strong> {{ selectedEmployee.languages }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="detailsDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import OrgNode from './components/OrgNode.vue'
import draggable from 'vuedraggable'
import orgData from './data/orgData.js'
import { buildTree, flattenTree, generateUniqueId, addCounts } from './utils/treeUtils.js'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  components: {
    OrgNode,
    draggable
  },
  data() {
    return {
      flatNodes: JSON.parse(localStorage.getItem('orgData')) || orgData,
      tree: [],
      dialog: false,
      detailsDialog: false,
      isEdit: false,
      form: { id: null, parentId: null, name: '', position: '', experience: '', languages: '', avatar: '', managerId: null },
      currentNode: null,
      searchQuery: '',
      isDarkMode: false,
      selectedEmployee: null,
    }
  },
  computed: {
    company() {
      return this.tree.find(node => node.position === 'Company') || { name: 'AX Capital', count: 0 };
    },
    departments() {
      return (this.company.children || []).map(dept => ({
        ...dept,
        expanded: true  // Default expanded
      }));
    },
    filteredDepartments() {
      if (!this.searchQuery) return this.departments;
      const query = this.searchQuery.toLowerCase();
      return this.departments.map(dept => {
        const filteredChildren = (dept.children || []).filter(child => this.filterNode(child, query));
        return {
          ...dept,
          children: filteredChildren,
          count: 1 + filteredChildren.reduce((sum, child) => sum + (child.count || 1), 0) - filteredChildren.length  // Adjust count
        };
      }).filter(dept => dept.children.length > 0 || dept.name.toLowerCase().includes(query));
    },
    totalEmployees() {
      return this.company.count || 0;
    },
  },
  watch: {
    isDarkMode(val) {
      this.$vuetify.theme.dark = val;
    },
  },
  mounted() {
    this.tree = addCounts(buildTree(this.flatNodes));
    this.isDarkMode = this.$vuetify.theme.dark;  // Sync with Vuetify
  },
  methods: {
    saveData() {
      this.flatNodes = flattenTree(this.tree);
      localStorage.setItem('orgData', JSON.stringify(this.flatNodes));
      this.tree = addCounts(buildTree(this.flatNodes));
    },
    openAddDialog(parent) {
      this.isEdit = false;
      this.currentNode = parent;
      this.form = {
        id: null,
        parentId: parent.id,
        name: '',
        position: '',
        experience: '',
        languages: '',
        avatar: '',
        managerId: null
      };
      this.dialog = true;
    },
    openEditDialog(node) {
      this.isEdit = true;
      this.currentNode = node;
      this.form = { ...node };
      this.dialog = true;
    },
    saveForm() {
      if (this.form.managerId) this.form.parentId = this.form.managerId;  // Support manager assignment
      if (!this.form.id) {
        this.form.id = generateUniqueId(this.flatNodes);
        this.currentNode.children.push(this.form);
      } else {
        Object.assign(this.currentNode, this.form);
      }
      this.saveData();
      this.dialog = false;
    },
    deleteNode(node) {
      if (confirm('Delete this item and all subordinates? This cannot be undone.')) {
        const removeFromTree = (nodes) => {
          return nodes.filter(n => n.id !== node.id).map(n => {
            if (n.children) n.children = removeFromTree(n.children);
            return n;
          });
        };
        this.tree = removeFromTree(this.tree);
        this.saveData();
      }
    },
    exportData() {
      const dataStr = JSON.stringify(this.flatNodes, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ax-capital-org-hierarchy.json';
      a.click();
      URL.revokeObjectURL(url);
    },
    async exportToPDF() {
      const pdf = new jsPDF('l', 'mm', 'a3');  // Landscape for wide chart
      const canvas = await html2canvas(document.querySelector('.departments-horizontal'));
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save('ax-capital-org-chart.pdf');
    },
    filterNode(node, query) {
      if (node.name.toLowerCase().includes(query) || node.position.toLowerCase().includes(query)) return true;
      if (node.children) node.children = node.children.filter(child => this.filterNode(child, query));
      return node.children && node.children.length > 0;
    },
    getManagerName(parentId) {
      const manager = this.flatNodes.find(node => node.id === parentId);
      return manager ? manager.name : 'None';
    },
    subordinateCount(node) {
      return (node.count || 1) - 1;
    },
    showDetails(employee) {
      this.selectedEmployee = employee;
      this.detailsDialog = true;
    },
  }
}
</script>

<style scoped>
.background-grey {
  background: #f4f6f9;
}

.departments-horizontal {
  min-height: 100vh;
}

.department-column {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.employees-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  min-height: 100px;
  width: 100%;
}

.employee-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Hierarchy Arrows */
.employees-list > .employee-wrapper:not(:first-child) {
  margin-top: 80px;
}

.employees-list > .employee-wrapper:not(:first-child)::before {
  content: '';
  position: absolute;
  top: -70px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 60px;
  background: linear-gradient(to bottom, #aaaaaa, #666666);
  border-radius: 4px;
  animation: line-pulse 2s infinite alternate;
}

.employees-list > .employee-wrapper:not(:first-child)::after {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 18px;
  height: 18px;
  border-bottom: 5px solid #666666;
  border-right: 5px solid #666666;
  background: transparent;
  animation: arrow-bounce 1.5s infinite;
}

@keyframes line-pulse {
  from { opacity: 0.7; }
  to { opacity: 1; }
}

@keyframes arrow-bounce {
  0%, 100% { transform: translateX(-50%) rotate(45deg) translateY(0); }
  50% { transform: translateX(-50%) rotate(45deg) translateY(4px); }
}

.ghost-card {
  opacity: 0.7;
  background: #bbdefb !important;
  border: 3px dashed #2196f3;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.3);
}
</style>
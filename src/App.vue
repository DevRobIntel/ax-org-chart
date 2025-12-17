<template>
  <v-app :dark="isDarkMode">
    <!-- App Bar with Responsive Elements -->
    <v-app-bar app color="primary" :dark="!isDarkMode" elevation="4">
      <v-toolbar-title class="text-subtitle-1 text-md-h6 font-weight-bold">
        AX Capital Org Chart
      </v-toolbar-title>
      <v-spacer />

      <!-- Search Field - Full on md+, Icon on smaller screens -->
      <v-text-field
        v-if="$vuetify.display.mdAndUp"
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        label="Search Employees"
        class="mx-4"
        hide-details
        clearable
        outlined
        dense
        rounded
        style="max-width: 320px;"
      />

      <v-btn
        v-else
        icon
        @click="mobileSearch = true"
        class="mx-2"
        large
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <!-- Dark Mode Toggle - Full on sm+, Icon on xs -->
      <v-switch
        v-model="isDarkMode"
        inset
        hide-details
        class="mx-4 d-none d-sm-flex"
        :label="$vuetify.display.smAndUp ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''"
      />

      <v-btn
        v-if="$vuetify.display.xs"
        icon
        @click="isDarkMode = !isDarkMode"
        class="mx-2"
      >
        <v-icon>{{ isDarkMode ? 'mdi-white-balance-sunny' : 'mdi-moon-waxing-crescent' }}</v-icon>
      </v-btn>

      <!-- Export Buttons -->
      <v-btn icon @click="exportData" class="mx-1">
        <v-icon>mdi-download</v-icon>
      </v-btn>

      <v-btn icon @click="exportToPDF">
        <v-icon>mdi-file-pdf-box</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Mobile Fullscreen Search Dialog -->
    <v-dialog
      v-model="mobileSearch"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary" dense>
          <v-btn icon dark @click="mobileSearch = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-text-field
            v-model="searchQuery"
            autofocus
            placeholder="Search employees..."
            prepend-inner-icon="mdi-magnify"
            single-line
            hide-details
            clearable
            dark
            class="mx-2"
          />
        </v-toolbar>
      </v-card>
    </v-dialog>

    <v-main>
      <v-container fluid class="pa-4 pa-sm-8 background-grey">
        <!-- Company Root Card -->
        <div class="text-center mb-8 mb-sm-12">
          <v-card
            max-width="700"
            class="mx-auto pa-4 pa-sm-8"
            elevation="16"
            rounded="xl"
            color="accent lighten-4"
          >
            <v-card-title class="text-h5 text-sm-h4 font-weight-bold justify-center flex-wrap">
              {{ company.name }}
              <v-badge
                color="success"
                :content="totalEmployees"
                offset-x="24"
                offset-y="24"
                class="ml-4"
              >
                <v-icon large color="success darken-2">mdi-account-group</v-icon>
              </v-badge>
            </v-card-title>
            <v-card-subtitle class="text-subtitle-1 text-sm-h6 mt-2">
              Total Employees Across All Departments
            </v-card-subtitle>
            <v-card-actions class="justify-center mt-4">
              <v-btn icon large @click="openEditDialog(company)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon large @click="openAddDialog(company)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>

        <!-- Departments Container - Responsive Layout -->
        <div
          class="departments-container"
          :class="{
            'd-flex overflow-x-auto pb-4': $vuetify.display.smAndUp,
            'd-flex flex-column align-center': $vuetify.display.xs
          }"
          style="gap: 40px;"
        >
          <div
            v-for="dept in filteredDepartments"
            :key="dept.id"
            class="department-column"
            :class="{ 'w-100': $vuetify.display.xs }"
            style="max-width: 380px;"
          >
            <!-- Department Header Card -->
            <v-card
              class="mb-8 pa-4 pa-sm-6 text-center"
              :width="$vuetify.display.xs ? '100%' : '360'"
              elevation="14"
              color="primary lighten-5"
              rounded="xl"
            >
              <v-card-title class="text-h6 text-sm-h5 font-weight-bold justify-center flex-wrap">
                {{ dept.name }}
                <v-badge
                  color="info"
                  :content="dept.count"
                  offset-x="20"
                  offset-y="20"
                  class="ml-4"
                >
                  <v-icon large color="info darken-2">mdi-account-multiple</v-icon>
                </v-badge>
              </v-card-title>
              <v-card-subtitle class="text-subtitle-1 mt-2">
                {{ dept.position }}
              </v-card-subtitle>
              <v-card-actions class="justify-center mt-6">
                <v-btn
                  icon
                  large
                  @click="dept.expanded = !dept.expanded"
                  class="mx-2"
                >
                  <v-icon>{{ dept.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
                <v-btn icon large @click="openEditDialog(dept)" class="mx-2">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon large @click="deleteNode(dept)" class="mx-2">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon large @click="openAddDialog(dept)" class="mx-2">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>

            <!-- Expandable Employees List -->
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
    <v-dialog v-model="dialog" max-width="550px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ isEdit ? 'Edit' : 'Add New' }} {{ form.position === 'Department' ? 'Department' : 'Employee' }}
        </v-card-title>
        <v-card-text class="pt-6">
          <v-text-field
            v-model="form.name"
            label="Name"
            outlined
            dense
            class="mb-4"
          />
          <v-text-field
            v-model="form.position"
            label="Position / Title"
            outlined
            dense
            class="mb-4"
          />
          <v-text-field
            v-model="form.experience"
            label="Experience (e.g. 19 years)"
            outlined
            dense
            class="mb-4"
          />
          <v-text-field
            v-model="form.languages"
            label="Languages"
            outlined
            dense
            class="mb-4"
          />
          <v-text-field
            v-model="form.avatar"
            label="Avatar URL (optional)"
            outlined
            dense
            class="mb-4"
          />
          <v-text-field
            v-model="form.managerId"
            label="Manager ID (for sub-department/team)"
            outlined
            dense
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey darken-1" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="saveForm" large>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Employee Details Modal -->
    <v-dialog v-model="detailsDialog" max-width="650px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Employee Details
        </v-card-title>
        <v-card-text class="pt-6" v-if="selectedEmployee">
          <div class="text-center mb-6">
            <v-avatar size="120" class="elevation-8">
              <v-img :src="selectedEmployee.avatar || 'https://via.placeholder.com/120'" />
            </v-avatar>
          </div>
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="font-weight-bold">Name</td>
                  <td>{{ selectedEmployee.name }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Position</td>
                  <td>{{ selectedEmployee.position }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Manager</td>
                  <td>{{ getManagerName(selectedEmployee.parentId) }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Subordinates</td>
                  <td>{{ subordinateCount(selectedEmployee) }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Experience</td>
                  <td>{{ selectedEmployee.experience || 'Not specified' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Languages</td>
                  <td>{{ selectedEmployee.languages || 'Not specified' }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="detailsDialog = false">
            Close
          </v-btn>
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
      form: {
        id: null,
        parentId: null,
        name: '',
        position: '',
        experience: '',
        languages: '',
        avatar: '',
        managerId: null
      },
      currentNode: null,
      searchQuery: '',
      isDarkMode: false,
      selectedEmployee: null,
      mobileSearch: false,
    }
  },
  computed: {
    company() {
      return this.tree.find(node => node.position === 'Company') || { name: 'AX Capital', count: 0 };
    },
    departments() {
      return (this.company.children || []).map(dept => ({
        ...dept,
        expanded: true
      }));
    },
    filteredDepartments() {
      if (!this.searchQuery.trim()) return this.departments;
      const query = this.searchQuery.toLowerCase();
      return this.departments
        .map(dept => {
          const filteredChildren = this.deepFilter(dept.children || [], query);
          return {
            ...dept,
            children: filteredChildren,
            count: filteredChildren.length > 0 
              ? 1 + filteredChildren.reduce((sum, c) => sum + (c.count || 1), 0)
              : 1
          };
        })
        .filter(dept => 
          dept.children.length > 0 || 
          dept.name.toLowerCase().includes(query) ||
          dept.position.toLowerCase().includes(query)
        );
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
    this.isDarkMode = this.$vuetify.theme.dark;
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
      if (this.form.managerId) this.form.parentId = this.form.managerId;
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
      if (confirm('Delete this item and all subordinates? This action cannot be undone.')) {
        const removeFromTree = (nodes) => {
          return nodes
            .filter(n => n.id !== node.id)
            .map(n => {
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
      const pdf = new jsPDF('l', 'mm', 'a3');
      const element = document.querySelector('.departments-container') || document.body;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('ax-capital-org-chart.pdf');
    },
    deepFilter(nodes, query) {
      return nodes.filter(node => {
        const matches = node.name.toLowerCase().includes(query) || 
                       node.position.toLowerCase().includes(query);
        if (node.children) {
          const filteredChildren = this.deepFilter(node.children, query);
          node.children = filteredChildren;
          return matches || filteredChildren.length > 0;
        }
        return matches;
      });
    },
    getManagerName(parentId) {
      const manager = this.flatNodes.find(node => node.id === parentId);
      return manager ? manager.name : 'Company';
    },
    subordinateCount(node) {
      return (node.count || 1) - 1;
    },
  }
}
</script>

<style scoped>
.background-grey {
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  min-height: 100vh;
}

/* Responsive departments container */
.departments-container {
  padding: 20px 0;
}

/* Mobile: vertical stack */
@media (max-width: 599px) {
  .departments-container {
    flex-direction: column !important;
    align-items: center;
  }
  .department-column {
    width: 100% !important;
    max-width: 100%;
  }
}

/* Tablet/Desktop: horizontal scroll */
@media (min-width: 600px) {
  .departments-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Department column styling */
.department-column {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 6px 25px rgba(0,0,0,0.1);
  padding: 16px;
}

/* Employee list and arrows */
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

/* Hierarchy arrows - adjusted for mobile */
.employees-list > .employee-wrapper:not(:first-child) {
  margin-top: 80px;
}

@media (max-width: 599px) {
  .employees-list > .employee-wrapper:not(:first-child) {
    margin-top: 70px;
  }
  .employees-list > .employee-wrapper:not(:first-child)::before {
    height: 60px;
    top: -70px;
  }
  .employees-list > .employee-wrapper:not(:first-child)::after {
    top: -18px;
  }
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

/* Card scaling for mobile */
.org-node .v-card {
  width: 100% !important;
  max-width: 340px;
}

/* Touch-friendly buttons */
.v-btn {
  min-width: 48px !important;
  min-height: 48px !important;
}

/* Smooth transitions */
.v-expand-transition {
  transition: all 0.4s ease;
}
</style>
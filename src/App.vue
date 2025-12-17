<template>
  <v-app :dark="isDarkMode">
    <v-navigation-drawer v-model="drawer" app temporary right>
      <v-list nav dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">AX Capital</v-list-item-title>
            <v-list-item-subtitle>Org Manager</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="isDarkMode" inset color="primary" />
          </v-list-item-action>
          <v-list-item-title>Dark Mode</v-list-item-title>
        </v-list-item>
        <v-list-item @click="exportData">
          <v-list-item-icon><v-icon>mdi-download</v-icon></v-list-item-icon>
          <v-list-item-title>Export JSON</v-list-item-title>
        </v-list-item>
        <v-list-item @click="exportToPDF">
          <v-list-item-icon><v-icon>mdi-file-pdf-box</v-icon></v-list-item-icon>
          <v-list-item-title>Export PDF</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" :dark="!isDarkMode" elevation="4">
      <v-toolbar-title class="text-subtitle-1 text-sm-h6 font-weight-black">
        AX <span class="font-weight-light">CAPITAL</span>
      </v-toolbar-title>

      <v-spacer />

      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        label="Search Employees..."
        class="mx-2 mx-md-4 search-bar-responsive"
        hide-details
        clearable
        outlined
        dense
      />

      <div class="d-none d-md-flex align-center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="exportData" class="mx-1">
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>Export JSON</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="exportToPDF" class="mx-1">
              <v-icon>mdi-file-pdf-box</v-icon>
            </v-btn>
          </template>
          <span>Export PDF</span>
        </v-tooltip>

        <v-switch v-model="isDarkMode" inset hide-details class="ml-4 mt-0" />
      </div>

      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-0 background-grey fill-height align-start">
        <div class="full-width pa-4 pa-sm-8">
          <v-row justify="center">
            <v-col cols="12" sm="10" md="8" lg="6">
              <v-card
                class="mx-auto mb-4 mb-md-10 pa-4 pa-sm-6 text-center root-card"
                elevation="12"
                rounded="xl"
                color="accent lighten-4"
              >
                <v-card-title class="text-h5 text-sm-h4 font-weight-bold justify-center">
                  {{ company.name }}
                  <v-badge
                    color="success"
                    :content="totalEmployees"
                    class="ml-4"
                    overlap
                    offset-x="10"
                    offset-y="10"
                  >
                    <v-icon large color="success darken-2">mdi-account-group</v-icon>
                  </v-badge>
                </v-card-title>
                <v-card-subtitle class="text-subtitle-1 mt-2">
                  Organization Structure Overview
                </v-card-subtitle>
                <v-card-actions class="justify-center">
                  <v-btn color="primary" small rounded @click="openEditDialog(company)">
                    <v-icon left small>mdi-pencil</v-icon> Edit Name
                  </v-btn>
                  <v-btn color="success" small rounded @click="openAddDialog(company)">
                    <v-icon left small>mdi-plus</v-icon> Add Dept
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <div class="org-container" ref="printArea">
            <div
              v-for="dept in filteredDepartments"
              :key="dept.id"
              class="dept-column"
            >
              <v-card
                class="dept-header-card mb-6 mb-md-10 pa-4"
                elevation="8"
                color="white"
                rounded="lg"
              >
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="text-h6 font-weight-bold primary--text text-truncate">
                    {{ dept.name }}
                  </div>
                  <v-chip small color="info" outlined>
                    {{ dept.count }} Headcount
                  </v-chip>
                </div>
                
                <v-divider class="mb-3"></v-divider>
                
                <div class="d-flex justify-center">
                  <v-btn icon small color="grey darken-1" @click="dept.expanded = !dept.expanded">
                    <v-icon>{{ dept.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                  <v-btn icon small color="primary" @click="openEditDialog(dept)">
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small color="error" @click="deleteNode(dept)">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn icon small color="success" @click="openAddDialog(dept)">
                    <v-icon small>mdi-plus</v-icon>
                  </v-btn>
                </div>
              </v-card>

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
                          @show-details="showDetails"
                        />
                      </div>
                    </template>
                  </draggable>
                </div>
              </v-expand-transition>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>

    <v-dialog v-model="dialog" max-width="550px" persistent scrollable>
      <v-card rounded="xl">
        <v-card-title class="headline primary white--text">
          <v-icon left dark>{{ isEdit ? 'mdi-account-edit' : 'mdi-account-plus' }}</v-icon>
          {{ isEdit ? 'Update Details' : 'Add New Entry' }}
        </v-card-title>
        
        <v-card-text class="pt-6">
          <v-row dense>
            <v-col cols="12">
              <v-text-field v-model="form.name" label="Full Name" outlined prepend-inner-icon="mdi-account" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="form.position" label="Role / Title" outlined prepend-inner-icon="mdi-briefcase" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.experience" label="Experience" outlined placeholder="e.g. 5 Years" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.languages" label="Languages" outlined placeholder="English, Arabic" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="form.avatar" label="Avatar Image URL" outlined prepend-inner-icon="mdi-camera" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="grey darken-1" text @click="dialog = false">Discard</v-btn>
          <v-btn color="primary" depressed large rounded @click="saveForm" class="px-8">
            {{ isEdit ? 'Save Changes' : 'Create Entry' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailsDialog" max-width="450px">
      <v-card v-if="selectedEmployee" rounded="xl" class="overflow-hidden">
        <v-img height="180" src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600">
          <div class="fill-height d-flex align-end justify-center pb-4">
            <v-avatar size="100" class="elevation-10 border-white">
              <v-img :src="selectedEmployee.avatar || 'https://via.placeholder.com/150'" />
            </v-avatar>
          </div>
        </v-img>

        <v-card-text class="text-center pt-10">
          <div class="text-h5 font-weight-bold">{{ selectedEmployee.name }}</div>
          <div class="text-subtitle-1 primary--text mb-4">{{ selectedEmployee.position }}</div>
          
          <v-divider class="mb-4"></v-divider>
          
          <v-row class="text-left px-4">
            <v-col cols="6">
              <div class="caption grey--text">MANAGER</div>
              <div class="body-2 font-weight-medium">{{ getManagerName(selectedEmployee.parentId) }}</div>
            </v-col>
            <v-col cols="6">
              <div class="caption grey--text">TEAM SIZE</div>
              <div class="body-2 font-weight-medium">{{ subordinateCount(selectedEmployee) }} Reports</div>
            </v-col>
            <v-col cols="12" class="pt-0">
              <div class="caption grey--text">EXPERIENCE</div>
              <div class="body-2 font-weight-medium">{{ selectedEmployee.experience || 'Not Specified' }}</div>
            </v-col>
            <v-col cols="12" class="pt-0">
              <div class="caption grey--text">LANGUAGES</div>
              <div class="body-2 font-weight-medium">{{ selectedEmployee.languages || 'English' }}</div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn block color="primary" text @click="detailsDialog = false">Close Profile</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import OrgNode from './components/OrgNode.vue'
import draggable from 'vuedraggable'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Mock Data Internalized for demonstration if external files missing
const defaultOrgData = [
  { id: '1', parentId: null, name: 'AX Capital Corp', position: 'Company', experience: '10 Years', languages: 'Multilingual' },
  { id: '2', parentId: '1', name: 'Operations', position: 'Department' },
  { id: '3', parentId: '1', name: 'Sales', position: 'Department' },
  { id: '4', parentId: '2', name: 'John Doe', position: 'COO', experience: '15 Years', languages: 'English' }
];

/** * Utility functions for tree management
 */
const treeUtils = {
  buildTree(nodes) {
    const map = {};
    const tree = [];
    nodes.forEach(node => {
      map[node.id] = { ...node, children: [] };
    });
    nodes.forEach(node => {
      if (node.parentId) {
        if (map[node.parentId]) {
          map[node.parentId].children.push(map[node.id]);
        }
      } else {
        tree.push(map[node.id]);
      }
    });
    return tree;
  },
  flattenTree(nodes) {
    let result = [];
    nodes.forEach(node => {
      const { children, ...rest } = node;
      result.push(rest);
      if (children && children.length) {
        result = result.concat(this.flattenTree(children));
      }
    });
    return result;
  },
  addCounts(nodes) {
    return nodes.map(node => {
      let count = 1;
      if (node.children && node.children.length) {
        node.children = this.addCounts(node.children);
        count += node.children.reduce((acc, child) => acc + (child.count || 1), 0);
      }
      return { ...node, count };
    });
  }
};

export default {
  name: 'OrgChartManager',
  components: { OrgNode, draggable },
  data() {
    return {
      drawer: false,
      flatNodes: JSON.parse(localStorage.getItem('orgData')) || defaultOrgData,
      tree: [],
      dialog: false,
      detailsDialog: false,
      isEdit: false,
      isDarkMode: false,
      searchQuery: '',
      selectedEmployee: null,
      currentNode: null,
      snackbar: { show: false, text: '', color: 'success' },
      form: { 
        id: null, 
        parentId: null, 
        name: '', 
        position: '', 
        experience: '', 
        languages: '', 
        avatar: '' 
      }
    };
  },
  computed: {
    company() {
      return this.tree.find(n => n.position === 'Company') || { name: 'New Entity', count: 0 };
    },
    departments() {
      return (this.company.children || []).map(dept => ({
        ...dept,
        expanded: dept.expanded !== undefined ? dept.expanded : true
      }));
    },
    filteredDepartments() {
      if (!this.searchQuery) return this.departments;
      const q = this.searchQuery.toLowerCase();
      
      const filterRecursive = (node) => {
        const matches = node.name.toLowerCase().includes(q) || node.position.toLowerCase().includes(q);
        const filteredChildren = (node.children || []).filter(c => filterRecursive(c));
        return matches || filteredChildren.length > 0;
      };

      return this.departments.filter(dept => filterRecursive(dept));
    },
    totalEmployees() {
      return this.company.count || 0;
    }
  },
  watch: {
    isDarkMode(val) {
      this.$vuetify.theme.dark = val;
    }
  },
  mounted() {
    this.refreshTree();
    this.isDarkMode = this.$vuetify.theme.dark;
  },
  methods: {
    refreshTree() {
      this.tree = treeUtils.addCounts(treeUtils.buildTree(this.flatNodes));
    },
    saveData() {
      this.flatNodes = treeUtils.flattenTree(this.tree);
      localStorage.setItem('orgData', JSON.stringify(this.flatNodes));
      this.refreshTree();
    },
    openAddDialog(parent) {
      this.isEdit = false;
      this.currentNode = parent;
      this.form = { id: null, parentId: parent.id, name: '', position: '', experience: '', languages: '', avatar: '' };
      this.dialog = true;
    },
    openEditDialog(node) {
      this.isEdit = true;
      this.currentNode = node;
      this.form = { ...node };
      this.dialog = true;
    },
    saveForm() {
      if (!this.form.name) return;
      
      if (this.isEdit) {
        const index = this.flatNodes.findIndex(n => n.id === this.form.id);
        if (index !== -1) {
          this.$set(this.flatNodes, index, { ...this.form });
        }
      } else {
        const newId = Date.now().toString();
        this.flatNodes.push({ ...this.form, id: newId });
      }
      
      this.saveData();
      this.dialog = false;
      this.notify(this.isEdit ? 'Updated successfully' : 'Added successfully');
    },
    deleteNode(node) {
      if (confirm('Delete this item and all subordinates?')) {
        const idsToDelete = this.getIdsRecursive(node);
        this.flatNodes = this.flatNodes.filter(n => !idsToDelete.includes(n.id));
        this.saveData();
        this.notify('Deleted successfully', 'error');
      }
    },
    getIdsRecursive(node) {
      let ids = [node.id];
      if (node.children) {
        node.children.forEach(c => {
          ids = ids.concat(this.getIdsRecursive(c));
        });
      }
      return ids;
    },
    showDetails(employee) {
      this.selectedEmployee = employee;
      this.detailsDialog = true;
    },
    getManagerName(parentId) {
      const manager = this.flatNodes.find(n => n.id === parentId);
      return manager ? manager.name : 'Top Level';
    },
    subordinateCount(node) {
      return (node.count || 1) - 1;
    },
    notify(text, color = 'success') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    exportData() {
      const blob = new Blob([JSON.stringify(this.flatNodes, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'org-chart-export.json';
      link.click();
    },
    async exportToPDF() {
      const canvas = await html2canvas(this.$refs.printArea, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a3');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('AX-Capital-Org-Chart.pdf');
    }
  }
};
</script>

<style scoped>
/* Responsive Layout Containers */
.background-grey {
  background: #f0f2f5;
}

.full-width {
  width: 100%;
}

.search-bar-responsive {
  max-width: 300px;
  transition: all 0.3s ease;
}

@media (max-width: 600px) {
  .search-bar-responsive {
    max-width: 150px;
  }
}

/* Horizontal scroll on desktop, Vertical stack on mobile */
.org-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 50px;
}

@media (min-width: 960px) {
  .org-container {
    flex-direction: row;
    overflow-x: auto;
    align-items: flex-start;
    padding: 20px;
    min-height: 80vh;
  }
  
  .dept-column {
    min-width: 380px;
    flex-shrink: 0;
  }
}

.dept-header-card {
  border-top: 5px solid #1976D2; /* Primary color indicator */
}

.root-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

/* Drag and Drop Styling */
.employees-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
  padding-top: 10px;
}

.employee-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 60px; /* Space for the arrow connector */
}

/* Vertical Arrow Connectors */
.employee-wrapper::after {
  content: '';
  position: absolute;
  bottom: -45px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 40px;
  background: #bdbdbd;
}

/* Hide arrow on the very last element of the list if needed, 
   or handle via logic in OrgNode for leaves */

.ghost-card {
  opacity: 0.5;
  background: #c8e6c9 !important;
  border: 2px dashed #4caf50 !important;
}

/* Profile Visuals */
.border-white {
  border: 4px solid white;
}

/* Custom Scrollbar for Desktop */
.org-container::-webkit-scrollbar {
  height: 8px;
}
.org-container::-webkit-scrollbar-track {
  background: #e0e0e0;
  border-radius: 10px;
}
.org-container::-webkit-scrollbar-thumb {
  background: #1976D2;
  border-radius: 10px;
}
</style>
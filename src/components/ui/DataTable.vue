<template>
  <div class="dt-wrapper">
    <table class="dt">
      <thead>
        <tr>
          <th v-if="selectable" class="dt__th dt__th--check">
            <input type="checkbox" :checked="allSelected" @change="toggleAll" />
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            class="dt__th"
            :class="{ 'dt__th--sortable': col.sortable }"
            :style="col.width ? { width: col.width } : {}"
            @click="col.sortable ? sort(col.key) : undefined"
          >
            {{ col.label }}
            <span v-if="col.sortable" class="dt__sort-icon">
              <AppIcon v-if="sortState?.field === col.key" :name="sortState.dir === 'asc' ? 'chevron-right' : 'chevron-left'" :size="11" />
              <span v-else class="dt__sort-neutral">&#8597;</span>
            </span>
          </th>
          <th v-if="$slots.actions" class="dt__th dt__th--actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="colSpan" class="dt__empty">
            <div class="dt__skeleton-rows">
              <SkeletonLoader v-for="i in 5" :key="i" height="40px" radius="0" />
            </div>
          </td>
        </tr>
        <tr v-else-if="!rows.length">
          <td :colspan="colSpan" class="dt__empty">{{ emptyText }}</td>
        </tr>
        <template v-else>
          <tr
            v-for="row in rows"
            :key="(row as Record<string, unknown>)[rowKey] as string"
            class="dt__row"
            :class="{ 'dt__row--selected': selected.includes((row as Record<string, unknown>)[rowKey] as string) }"
          >
            <td v-if="selectable" class="dt__td dt__td--check">
              <input v-model="selected" type="checkbox" :value="(row as Record<string, unknown>)[rowKey]" />
            </td>
            <td v-for="col in columns" :key="col.key" class="dt__td">
              <slot :name="`cell-${col.key}`" :row="row" :value="(row as Record<string, unknown>)[col.key]">
                {{ (row as Record<string, unknown>)[col.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="dt__td dt__td--actions">
              <slot name="actions" :row="row" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div v-if="total > pageSize" class="dt-pagination">
      <span class="dt-pagination__info">Showing {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, total) }} of {{ total }}</span>
      <div class="dt-pagination__controls">
        <button class="dt-pagination__btn" :disabled="page <= 1" @click="$emit('page', page - 1)"><AppIcon name="chevron-left" :size="14" /></button>
        <span class="dt-pagination__page">{{ page }} / {{ totalPages }}</span>
        <button class="dt-pagination__btn" :disabled="page >= totalPages" @click="$emit('page', page + 1)"><AppIcon name="chevron-right" :size="14" /></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SkeletonLoader from './SkeletonLoader.vue'
import AppIcon from './AppIcon.vue'
import type { SortState } from '@/types/common'

export interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    rows: unknown[]
    rowKey?: string
    loading?: boolean
    emptyText?: string
    selectable?: boolean
    sortState?: SortState
    total?: number
    page?: number
    pageSize?: number
  }>(),
  { rowKey: 'id', emptyText: 'No results found.', selectable: false, loading: false, sortState: undefined, total: 0, page: 1, pageSize: 20 },
)

const emit = defineEmits<{
  (e: 'sort', field: string): void
  (e: 'page', p: number): void
  (e: 'select', ids: string[]): void
}>()

const selected = ref<string[]>([])
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))
const colSpan = computed(() => props.columns.length + (props.selectable ? 1 : 0) + 1)
const allSelected = computed(() =>
  props.rows.length > 0 &&
  props.rows.every((r) => selected.value.includes((r as Record<string, unknown>)[props.rowKey] as string)),
)

function toggleAll() {
  if (allSelected.value) {
    selected.value = []
  } else {
    selected.value = props.rows.map((r) => (r as Record<string, unknown>)[props.rowKey] as string)
  }
  emit('select', selected.value)
}

function sort(field: string) {
  emit('sort', field)
}
</script>

<style scoped>
.dt-wrapper { overflow-x: auto; }
.dt {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.dt__th {
  padding: 10px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 2px solid var(--color-border-light);
  white-space: nowrap;
  background: var(--color-surface-2);
}
.dt__th--sortable { cursor: pointer; user-select: none; }
.dt__th--sortable:hover { color: var(--color-primary); }
.dt__th--check, .dt__td--check { width: 40px; text-align: center; }
.dt__th--actions, .dt__td--actions { width: 120px; text-align: right; }
.dt__sort-icon { margin-left: 4px; font-size: 10px; opacity: 0.6; }
.dt__td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border-light);
  vertical-align: middle;
  color: var(--color-text-primary);
}
.dt__row { transition: background var(--transition); }
.dt__row:hover { background: var(--color-surface-2); }
.dt__row--selected { background: rgba(40, 141, 169, 0.06); }
.dt__empty { padding: 40px; text-align: center; color: var(--color-text-muted); }
.dt__skeleton-rows { display: flex; flex-direction: column; gap: 2px; }

.dt-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}
.dt-pagination__controls { display: flex; align-items: center; gap: 10px; }
.dt-pagination__btn {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
  transition: background var(--transition);
}
.dt-pagination__btn:hover:not(:disabled) { background: var(--color-border-light); }
.dt-pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.dt-pagination__page { font-weight: 600; }
</style>

import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch, BASE_URL } from '../../api/client';
import { ConfirmDialog, DataTable, InfoBanner, SlidePanel } from '../../components/admin/AdminComponents';
import { useToast } from '../../components/admin/Toast';

const branchOptions = [{ value: '', label: 'All branches' }];
const sharedBranchField = { key: 'branch_id', label: 'Branch (blank = all branches)', type: 'select', optionsKey: 'branches', allowNull: true };
const serviceField = { key: 'service_id', label: 'Service', type: 'select', optionsKey: 'services', required: true };
const field = (key, label, type = 'text', extra = {}) => ({ key, label, type, ...extra });

export const ADMIN_RESOURCES = {
  branches: {
    title: 'Branches', description: 'Manage branch details and availability.', template: true,
    fields: [
      field('name_en', 'Name (English)', 'text', { required: true }), field('name_ar', 'Name (Arabic)', 'text', { required: true }),
      field('city_en', 'City (English)'), field('city_ar', 'City (Arabic)'), field('phone', 'Phone'), field('email', 'Email', 'email'),
      field('address_en', 'Address (English)', 'textarea'), field('address_ar', 'Address (Arabic)', 'textarea'),
      field('latitude', 'Latitude', 'number'), field('longitude', 'Longitude', 'number'), field('google_maps_url', 'Google Maps URL', 'url', { required: true }),
      field('is_active', 'Active', 'boolean'),
    ],
    columns: [
      { key: 'name_en', label: 'Branch' }, { key: 'city_en', label: 'City' }, { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' }, { key: 'is_active', label: 'Status', render: (row) => <StatusPill value={row.is_active !== false} /> },
    ],
  },
  services: {
    title: 'Services', description: 'Maintain shared or branch-specific treatments, descriptions, and details.', template: true,
    lookups: ['branches'],
    fields: [
      { ...sharedBranchField, required: false }, field('name_en', 'Name (English)', 'text', { required: true }), field('name_ar', 'Name (Arabic)', 'text', { required: true }),
      field('category', 'Category'), field('description_en', 'Description (English)', 'textarea'), field('description_ar', 'Description (Arabic)', 'textarea'),
      field('details', 'Additional details (JSON)', 'json'),
    ],
    columns: [
      { key: 'name_en', label: 'Service' }, { key: 'name_ar', label: 'Arabic name' }, { key: 'category', label: 'Category' },
      { key: 'branch_id', label: 'Branch', render: (row, lookups) => branchLabel(lookups.branches, row.branch_id) },
    ],
  },
  offers: {
    title: 'Offers', description: 'Create shared or branch-specific promotions and expiry dates.', template: true, lookups: ['branches'],
    fields: [
      { ...sharedBranchField, required: false }, field('title_en', 'Title (English)'), field('title_ar', 'Title (Arabic)'),
      field('description_en', 'Description (English)', 'textarea'), field('description_ar', 'Description (Arabic)', 'textarea'),
      field('valid_until', 'Valid until', 'date'), field('is_active', 'Active', 'boolean'),
    ],
    columns: [
      { key: 'title_en', label: 'Offer' }, { key: 'title_ar', label: 'Arabic title' }, { key: 'valid_until', label: 'Valid until' },
      { key: 'is_active', label: 'Status', render: (row) => <StatusPill value={row.is_active !== false} /> },
      { key: 'branch_id', label: 'Branch', render: (row, lookups) => branchLabel(lookups.branches, row.branch_id) },
    ],
  },
  prices: {
    title: 'Prices', description: 'Set shared or branch-specific service prices and currency.', template: true, lookups: ['branches', 'services'],
    fields: [
      { ...serviceField }, { ...sharedBranchField, required: false },
      field('price', 'Price', 'number', { required: true, min: 0, step: '0.01' }), field('currency', 'Currency', 'text', { defaultValue: 'AED' }),
    ],
    columns: [
      { key: 'service_id', label: 'Service', render: (row, lookups) => lookupLabel(lookups.services, row.service_id) },
      { key: 'branch_id', label: 'Branch', render: (row, lookups) => branchLabel(lookups.branches, row.branch_id) },
      { key: 'price', label: 'Price', render: (row) => `${row.currency || 'AED'} ${row.price ?? '-'}` },
    ],
  },
  'quick-replies': {
    title: 'Quick replies', description: 'Edit reusable agent responses in English and Arabic.', template: true, lookups: ['branches'],
    fields: [
      { ...sharedBranchField, required: false }, field('category', 'Category'), field('title_en', 'Title (English)'),
      field('title_ar', 'Title (Arabic)'), field('body_en', 'Reply (English)', 'textarea'), field('body_ar', 'Reply (Arabic)', 'textarea'),
      field('tags', 'Tags (comma separated)', 'array'),
    ],
    columns: [
      { key: 'title_en', label: 'Reply' }, { key: 'category', label: 'Category' },
      { key: 'branch_id', label: 'Branch', render: (row, lookups) => branchLabel(lookups.branches, row.branch_id) },
      { key: 'tags', label: 'Tags', render: (row) => Array.isArray(row.tags) ? row.tags.join(', ') : '-' },
    ],
  },
  'call-flows': {
    title: 'Call flows', description: 'Manage and reorder the steps agents follow during a call.', template: true, lookups: ['branches', 'services'],
    fields: [
      { ...serviceField, required: false, allowNull: true }, { ...sharedBranchField, required: false },
      field('step_order', 'Step order', 'number', { required: true, min: 1, step: '1' }), field('label_en', 'Step label (English)'),
      field('label_ar', 'Step label (Arabic)'), field('content_en', 'Step content (English)', 'textarea'),
      field('content_ar', 'Step content (Arabic)', 'textarea'), field('tip_en', 'Agent tip (English)', 'textarea'), field('tip_ar', 'Agent tip (Arabic)', 'textarea'),
    ],
    columns: [
      { key: 'step_order', label: 'Order' }, { key: 'label_en', label: 'Step' },
      { key: 'service_id', label: 'Service', render: (row, lookups) => lookupLabel(lookups.services, row.service_id) },
      { key: 'branch_id', label: 'Branch', render: (row, lookups) => branchLabel(lookups.branches, row.branch_id) },
    ],
  },
  media: {
    title: 'Media', description: 'Connect images, videos, and downloads to services and branches.', template: true, lookups: ['branches', 'services'],
    fields: [
      { ...serviceField }, { ...sharedBranchField, required: false }, field('title_en', 'Title (English)'), field('title_ar', 'Title (Arabic)'),
      field('caption_en', 'Caption (English)', 'textarea'), field('caption_ar', 'Caption (Arabic)', 'textarea'),
      field('thumbnail_url', 'Thumbnail URL', 'url'), field('full_url', 'Full image URL', 'url'), field('download_url', 'Download URL', 'url'),
      field('file_type', 'Media type', 'select', { options: ['image', 'video', 'document'].map((value) => ({ value, label: value })) }),
      field('tags', 'Tags (comma separated)', 'array'),
    ],
    columns: [
      { key: 'title_en', label: 'Media' }, { key: 'file_type', label: 'Type' },
      { key: 'service_id', label: 'Service', render: (row, lookups) => lookupLabel(lookups.services, row.service_id) },
      { key: 'branch_id', label: 'Branch', render: (row, lookups) => branchLabel(lookups.branches, row.branch_id) },
      { key: 'full_url', label: 'Source', render: (row) => row.full_url || row.download_url || '-' },
    ],
  },
  users: {
    title: 'Users', description: 'Manage staff accounts and assigned branch access.', lookups: ['branches'],
    fields: [
      field('username', 'Username', 'text', { required: true }),
      field('password', 'Password (create only)', 'password', { requiredOnCreate: true }),
      field('role', 'Role', 'select', { options: ['admin', 'branch_admin', 'agent'].map((value) => ({ value, label: value })) }),
      { ...sharedBranchField, required: false },
    ],
    columns: [
      { key: 'username', label: 'Username' }, { key: 'role', label: 'Role' },
      { key: 'branch_id', label: 'Branch', render: (row, lookups) => branchLabel(lookups.branches, row.branch_id) },
    ],
  },
};

const resourceSingular = {
  branches: 'Branch',
  services: 'Service',
  offers: 'Offer',
  prices: 'Price',
  'quick-replies': 'Quick reply',
  'call-flows': 'Call flow step',
  media: 'Media item',
  users: 'User',
};

function lookupLabel(options, value) {
  return options?.find((item) => String(item.value) === String(value))?.label || value || '-';
}

function branchLabel(options, value) {
  return value == null ? 'All branches (global)' : lookupLabel(options, value);
}

function StatusPill({ value }) {
  return <span className={`admin-status-pill ${value ? 'enabled' : 'disabled'}`}>{value ? 'Active' : 'Inactive'}</span>;
}

function toInputValue(value, definition) {
  if (value == null && definition.defaultValue !== undefined) return definition.defaultValue;
  if (value == null && definition.type === 'boolean') return true;
  if (definition.type === 'json') return JSON.stringify(value ?? {}, null, 2);
  if (definition.type === 'array') return Array.isArray(value) ? value.join(', ') : '';
  if (definition.type === 'select' && definition.allowNull && value == null) return '';
  return value ?? '';
}

function toPayload(form, config) {
  const payload = {};
  config.fields.forEach((definition) => {
    if (definition.type === 'password' && !form[definition.key]) return;
    const raw = form[definition.key];
    if (definition.type === 'json') {
      payload[definition.key] = raw ? JSON.parse(raw) : {};
    } else if (definition.type === 'array') {
      payload[definition.key] = raw.split(',').map((tag) => tag.trim()).filter(Boolean);
    } else if (definition.type === 'boolean') {
      payload[definition.key] = Boolean(raw);
    } else if (definition.type === 'number') {
      payload[definition.key] = raw === '' ? null : Number(raw);
    } else if (definition.type === 'select' && definition.allowNull) {
      payload[definition.key] = raw === '' ? null : Number(raw);
    } else if (raw !== '') {
      payload[definition.key] = raw;
    } else if (definition.type !== 'select' && !definition.required) {
      payload[definition.key] = null;
    }
  });
  return payload;
}

async function deleteRequest(path) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { method: 'DELETE' });
  } catch (error) {
    throw new Error(`Unable to reach the API at ${BASE_URL}. Check that the server is running.`, { cause: error });
  }
  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      if (typeof body?.error === 'string') message = body.error;
    } catch {
      // Preserve the HTTP status text for empty or non-JSON error bodies.
    }
    throw new Error(`API request failed (${response.status}): ${message}`);
  }
}

function FieldEditor({ definition, value, onChange, lookups }) {
  const common = {
    id: `admin-field-${definition.key}`,
    name: definition.key,
    required: definition.required,
    value: value ?? '',
    onChange: (event) => onChange(definition.key, event.target.value),
  };
  if (definition.type === 'boolean') {
    return <label className="admin-checkbox-field"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(definition.key, event.target.checked)} /><span>{definition.label}</span></label>;
  }
  if (definition.type === 'select') {
    const options = definition.optionsKey ? (lookups[definition.optionsKey] || []) : definition.options;
    return <select {...common}>
      {definition.allowNull && <option value="">{definition.key === 'service_id' ? 'General flow (no service)' : 'All branches (global)'}</option>}
      {options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>;
  }
  if (definition.type === 'textarea' || definition.type === 'json') {
    return <textarea {...common} rows={definition.type === 'json' ? 8 : 4} spellCheck={definition.type !== 'json'} />;
  }
  return <input {...common} type={definition.type === 'array' ? 'text' : definition.type || 'text'} min={definition.min} step={definition.step} placeholder={definition.type === 'array' ? 'Separate values with commas' : ''} autoComplete={definition.type === 'password' ? 'new-password' : 'off'} />;
}

export function AdminResourcePage({ resource }) {
  const config = ADMIN_RESOURCES[resource];
  const showToast = useToast();
  const [rows, setRows] = useState([]);
  const [lookups, setLookups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState(resource === 'call-flows' ? 'null' : '');
  const [serviceFilter, setServiceFilter] = useState(resource === 'call-flows' ? 'general' : '');
  const [deletedView, setDeletedView] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [reordering, setReordering] = useState(false);

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      data = await apiFetch(`/api/${resource}${deletedView ? '/deleted' : ''}`);
      setRows(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [deletedView, resource]);

  useEffect(() => { loadRows(); }, [loadRows]);

  useEffect(() => {
    let cancelled = false;
    Promise.all((config.lookups || []).map(async (name) => {
      const data = await apiFetch(`/api/${name}`);
      const keyName = name === 'quick-replies' ? 'quickReplies' : name;
      return [keyName, data.map((item) => ({
        value: item.id,
        label: item.name_en || item.title_en || item.username || `${name.slice(0, -1)} #${item.id}`,
      }))];
    })).then((entries) => {
      if (!cancelled) setLookups(Object.fromEntries(entries));
    }).catch((loadError) => {
      if (!cancelled) showToast(`Related records could not be loaded: ${loadError.message}`, 'error');
    });
    return () => { cancelled = true; };
  }, [config.lookups, showToast]);

  const scopedRows = useMemo(() => rows.filter((row) => {
    const matchesBranch = !branchFilter
      || (branchFilter === 'null' ? row.branch_id == null : String(row.branch_id) === branchFilter);
    const matchesService = resource !== 'call-flows'
      || (serviceFilter === 'general'
        ? row.service_id == null
        : !serviceFilter || String(row.service_id) === serviceFilter);
    return matchesBranch && matchesService;
  }), [branchFilter, resource, rows, serviceFilter]);
  const filteredRows = useMemo(() => {
    const lowerQuery = query.trim().toLocaleLowerCase();
    return scopedRows.filter((row) => {
      const searchable = Object.values(row).map((value) => typeof value === 'string' ? value : JSON.stringify(value)).join(' ').toLocaleLowerCase();
      return !lowerQuery || searchable.includes(lowerQuery);
    });
  }, [query, scopedRows]);
  const canReorder = resource === 'call-flows'
    && !deletedView
    && Boolean(branchFilter)
    && Boolean(serviceFilter)
    && !query.trim();

  const openForm = (record = null) => {
    const value = {};
    config.fields.forEach((definition) => {
      value[definition.key] = toInputValue(record?.[definition.key], definition);
    });
    setEditing(record || {});
    setForm(value);
  };

  async function saveRecord(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = toPayload(form, config);
      const isEditing = Boolean(editing?.id);
      await apiFetch(`/api/${resource}${isEditing ? `/${editing.id}` : ''}`, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      showToast(`${resourceSingular[resource]} ${isEditing ? 'updated' : 'created'} successfully.`);
      setEditing(null);
      await loadRows();
    } catch (saveError) {
      showToast(saveError instanceof SyntaxError ? 'Check the JSON field format and try again.' : saveError.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function runDelete() {
    if (!confirm) return;
    setSaving(true);
    try {
      const path = confirm.permanent ? `/api/${resource}/deleted/${confirm.row.id}` : `/api/${resource}/${confirm.row.id}`;
      await deleteRequest(path);
      showToast(confirm.permanent ? 'Record permanently deleted.' : 'Record moved to deleted items.');
      setConfirm(null);
      await loadRows();
    } catch (deleteError) {
      showToast(deleteError.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function restoreRecord(row) {
    try {
      await apiFetch(`/api/${resource}/${row.id}/restore`, { method: 'POST' });
      showToast('Record restored successfully.');
      await loadRows();
    } catch (restoreError) {
      showToast(restoreError.message, 'error');
    }
  }

  async function saveOrder() {
    setReordering(true);
    try {
      await apiFetch('/api/call-flows/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: scopedRows.map((row) => row.id) }),
      });
      showToast('Call flow order saved.');
      await loadRows();
    } catch (orderError) {
      showToast(orderError.message, 'error');
    } finally {
      setReordering(false);
    }
  }

  function moveStep(rowIndex, offset) {
    const next = [...scopedRows];
    const target = rowIndex + offset;
    if (target < 0 || target >= next.length) return;
    [next[rowIndex], next[target]] = [next[target], next[rowIndex]];
    const reordered = new Map(next.map((row, index) => [row.id, { ...row, step_order: index + 1 }]));
    setRows((current) => current
      .map((row) => reordered.get(row.id) || row)
      .sort((first, second) => first.step_order - second.step_order || first.id - second.id));
  }

  if (!config) return <InfoBanner tone="error">Unknown admin resource: {resource}</InfoBanner>;
  const columns = config.columns.map((column) => ({
    ...column,
    render: column.render ? (row) => column.render(row, lookups) : undefined,
  }));

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div><span className="admin-eyebrow">Content administration</span><h1>{config.title}</h1><p>{config.description}</p></div>
        <div className="admin-header-actions">
          <button className="admin-button primary" type="button" onClick={() => openForm()}>+ Add {resourceSingular[resource]}</button>
        </div>
      </header>

      <InfoBanner section={resource} />

      <div className="admin-toolbar">
        <label className="admin-search"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title}...`} aria-label={`Search ${config.title}`} /></label>
        {resource === 'call-flows' && <select className="admin-filter" value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)} aria-label="Filter call flows by service">
          <option value="general">General call flow</option>
          <option value="">All service flows</option>
          {lookups.services?.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>}
        {lookups.branches && <select className="admin-filter" value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)} aria-label="Filter by branch">
          {branchOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          {resource === 'call-flows' && <option value="null">Global / no branch</option>}
          {lookups.branches.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>}
        <button className={`admin-button ${deletedView ? 'primary' : 'secondary'}`} type="button" onClick={() => setDeletedView((current) => !current)}>{deletedView ? 'Active records' : 'Deleted items'}</button>
        <span className="admin-result-count">{filteredRows.length} record{filteredRows.length === 1 ? '' : 's'}</span>
      </div>

      {error && <InfoBanner tone="error" title="Could not load records">{error}</InfoBanner>}
      {deletedView && <InfoBanner>Deleted records can be restored, or permanently removed. Permanent deletion cannot be undone.</InfoBanner>}
      {resource === 'users' && <InfoBanner>Passwords are not returned by the API. To create an account, provide a password; the server will hash it. Leave the password empty on edit to keep the current password.</InfoBanner>}
      <DataTable
        columns={columns}
        rows={filteredRows}
        loading={loading}
        sortable={resource !== 'call-flows'}
        paginate={resource !== 'call-flows'}
        emptyMessage={error ? 'Records are unavailable until the API request succeeds.' : `No ${config.title.toLocaleLowerCase()} to show.`}
        renderActions={(row, index) => (
          deletedView ? <>
            <button className="admin-table-action" type="button" onClick={() => restoreRecord(row)}>Restore</button>
            <button className="admin-table-action danger-text" type="button" onClick={() => setConfirm({ row, permanent: true })}>Delete forever</button>
          </> : <>
            {resource === 'call-flows' && <span className="admin-order-actions">
              <button className="admin-table-action" type="button" aria-label="Move step up" disabled={!canReorder || index === 0} onClick={() => moveStep(index, -1)}>^</button>
              <button className="admin-table-action" type="button" aria-label="Move step down" disabled={!canReorder || index === scopedRows.length - 1} onClick={() => moveStep(index, 1)}>v</button>
            </span>}
            <button className="admin-table-action" type="button" onClick={() => openForm(row)}>Edit</button>
            <button className="admin-table-action danger-text" type="button" onClick={() => setConfirm({ row, permanent: false })}>Delete</button>
          </>
        )}
      />
      {resource === 'call-flows' && !deletedView && <div className="admin-table-footer">
        <span>{canReorder ? 'Change a step’s position with the arrows, then save the order.' : 'Select one service (or General flow) and one branch to reorder steps.'}</span>
        <button className="admin-button primary" type="button" disabled={reordering || !canReorder || scopedRows.length === 0} onClick={saveOrder}>{reordering ? 'Saving…' : 'Save step order'}</button>
      </div>}

      <SlidePanel
        open={Boolean(editing)}
        title={`${editing?.id ? 'Edit' : 'Add'} ${resourceSingular[resource]}`}
        description={editing?.id ? `Record #${editing.id}` : 'Enter the information for this record.'}
        onClose={() => !saving && setEditing(null)}
        footer={<><button className="admin-button secondary" type="button" disabled={saving} onClick={() => setEditing(null)}>Cancel</button><button className="admin-button primary" type="submit" form="admin-record-form" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button></>}
      >
        <form id="admin-record-form" className="admin-form" onSubmit={saveRecord}>
          {config.fields.filter((definition) => !(resource === 'users' && editing?.id && definition.key === 'password')).map((definition) => (
            <label className="admin-field" key={definition.key} htmlFor={`admin-field-${definition.key}`}>
              <span>{definition.label}{definition.required && <b aria-hidden="true"> *</b>}</span>
              <FieldEditor
                definition={{ ...definition, required: definition.required || (definition.requiredOnCreate && !editing?.id) }}
                value={form[definition.key]}
                lookups={lookups}
                onChange={(key, value) => setForm((previous) => ({ ...previous, [key]: value }))}
              />
            </label>
          ))}
          <p className="admin-required-note">Fields marked * are required.</p>
        </form>
      </SlidePanel>
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.permanent ? 'Permanently delete record?' : 'Move record to deleted items?'}
        message={confirm?.permanent
          ? 'This permanently removes the record and cannot be undone.'
          : `Delete record #${confirm?.row?.id}? You can restore it from Deleted items.`}
        confirmLabel={confirm?.permanent ? 'Delete permanently' : 'Delete'}
        requiredText={confirm?.permanent ? 'DELETE' : undefined}
        busy={saving}
        onCancel={() => setConfirm(null)}
        onConfirm={runDelete}
      />
    </section>
  );
}

export default AdminResourcePage;

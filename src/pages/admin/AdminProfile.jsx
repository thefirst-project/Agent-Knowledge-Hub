import { useState } from 'react';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/admin/Toast';

function meetsPasswordPolicy(value) {
  return value.length >= 8
    && /[a-z]/.test(value)
    && /[A-Z]/.test(value)
    && /\d/.test(value)
    && /[^A-Za-z0-9]/.test(value);
}

function AdminProfile() {
  const { user } = useAuth();
  const showToast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function changePassword(event) {
    event.preventDefault();
    if (!meetsPasswordPolicy(newPassword)) {
      showToast('Use at least 8 characters with uppercase, lowercase, number, and special character.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }
    setSaving(true);
    try {
      await apiFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed successfully.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div><span className="admin-eyebrow">Account</span><h1>My profile</h1><p>View your account details and update your password.</p></div>
      </header>
      <div className="admin-profile-card">
        <h2>Account details</h2>
        <dl>
          <div><dt>Username</dt><dd>{user.username}</dd></div>
          <div><dt>Role</dt><dd>{user.role === 'superadmin' ? 'Superadmin' : user.role === 'branch_admin' ? 'Branch Admin' : user.role}</dd></div>
          <div><dt>Branch</dt><dd>{user.branch_id ?? 'All branches'}</dd></div>
        </dl>
      </div>
      <form className="admin-profile-card admin-profile-form" onSubmit={changePassword}>
        <h2>Change password</h2>
        <label className="admin-field">
          <span>Current password</span>
          <input autoComplete="current-password" onChange={(event) => setCurrentPassword(event.target.value)} required type="password" value={currentPassword} />
        </label>
        <label className="admin-field">
          <span>New password</span>
          <input autoComplete="new-password" onChange={(event) => setNewPassword(event.target.value)} required type="password" value={newPassword} />
        </label>
        <label className="admin-field">
          <span>Confirm new password</span>
          <input autoComplete="new-password" onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} />
        </label>
        <p className="admin-required-note">At least 8 characters, including uppercase, lowercase, a number, and a special character.</p>
        <button className="admin-button primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save Password'}</button>
      </form>
    </section>
  );
}

export default AdminProfile;

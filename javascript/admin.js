// ==========================================
// WHITE EAGLES ADMIN - BACKEND INTEGRATION
// ==========================================

// --- STATE ---
let token = localStorage.getItem('sh_token');
const loginScreen = document.getElementById('loginScreen');

// ✅ MAKE SURE THIS SPELLING MATCHES YOUR RENDER URL EXACTLY!
const BACKEND_URL = 'https://white-eangles-contructor.onrender.com';

// If token exists in local storage, skip login and load dashboard
if (token) {
    loginScreen.style.display = 'none';
    loadDashboard();
}

const role = localStorage.getItem('sh_role');

// If no token, OR the role is not an admin role, kick them out!
if (!token || (role !== 'super_admin' && role !== 'editor')) {
    localStorage.removeItem('sh_token');
    localStorage.removeItem('sh_role');
    window.location.href = '/'; // Redirect to customer UI
}

// ---  Toast Notifications ---
function toast(msg, type = 'info') {
    const c = document.getElementById('toasts');
    const d = document.createElement('div');
    d.className = 'toast ' + type;
    const ic = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-circle-info' };
    d.innerHTML = `<i class="fas ${ic[type]}"></i> ${msg}`;
    c.appendChild(d);
    setTimeout(() => d.remove(), 3500);
}

// --- Password Toggle ---
function togglePassword() {
    const passInput = document.getElementById('loginPass');
    const icon = passInput.nextElementSibling.querySelector('i');
    if (passInput.type === 'password') {
        passInput.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        passInput.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}

// ✅ YOUR API WRAPPER (It handles the BACKEND_URL automatically!)
async function api(url, options = {}) {
    const headers = options.headers || {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const fullUrl = `${BACKEND_URL}${url}`; // It adds the URL here!

    try {
        const res = await fetch(fullUrl, { ...options, headers });

        if (res.status === 401) {
            logout();
            throw new Error('Unauthorized');
        }

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await res.json();
        } else {
            const text = await res.text();
            throw new Error('Server returned non-JSON response');
        }
    } catch (err) {
        console.error('API Error:', err);
        throw err;
    }
}

// ==========================================
// AUTHENTICATION
// ==========================================

async function handleLogin(e) {
    e.preventDefault();

    const u = document.getElementById('loginUser').value;
    const p = document.getElementById('loginPass').value;
    const errDiv = document.getElementById('loginError');

    if (!u || !p) {
        errDiv.textContent = 'Please fill in all fields';
        errDiv.style.display = 'block';
        return;
    }

    try {
        // ✅ FIXED: Removed BACKEND_URL from inside the call
        const data = await api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: u, password: p })
        });

        if (data.token) {
            token = data.token;
            localStorage.setItem('sh_token', token);
            localStorage.setItem('sh_role', data.role);
            loginScreen.style.display = 'none';
            toast('Welcome back, Admin!', 'success');
            loadDashboard();
        } else {
            errDiv.textContent = data.message;
            errDiv.style.display = 'block';
        }
    } catch (err) {
        errDiv.textContent = 'Network error. Is the backend running?';
        errDiv.style.display = 'block';
    }
}

function logout() {
    token = null;
    localStorage.removeItem('sh_token');
    localStorage.removeItem('sh_role');
    loginScreen.style.display = 'flex';
}

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

async function loadDashboard() {
    try {

        const [projRes, teamRes] = await Promise.all([api('/api/projects'), api('/api/team')]);

        document.getElementById('stat-proj-count').textContent = projRes.count || 0;
        document.getElementById('stat-team-count').textContent = teamRes.count || 0;
        document.getElementById('proj-count-badge').textContent = projRes.count || 0;

        const dashTable = document.getElementById('dash-proj-table');
        dashTable.innerHTML = '';
        (projRes.data || []).slice(0, 5).forEach(p => {
            dashTable.innerHTML += `
            <tr>
                <td><div style="display:flex;align-items:center;gap:8px;">
                    <div class="proj-thumb">${p.image_url ? `<img src="${BACKEND_URL}${p.image_url}">` : '🏗️'}</div>
                    <div style="font-weight:600;font-size:13px;">${p.title}</div>
                </div></td>
                <td>${p.category}</td>
                <td><span class="badge ${p.is_featured ? 'amber' : 'gray'}">${p.is_featured ? 'Featured' : 'Standard'}</span></td>
            </tr>`;
        });
    } catch (err) { console.error("Dashboard load error", err); }
}

async function loadProjects() {
    try {

        const data = await api('/api/projects');
        const tb = document.getElementById('projTableBody');
        tb.innerHTML = '';
        document.getElementById('proj-subtitle').textContent = `${data.count} total projects`;

        if (!data.data || data.data.length === 0) {
            tb.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--fg2);padding:40px;">No projects found.</td></tr>';
            return;
        }

        data.data.forEach(p => {
            tb.innerHTML += `
            <tr>
                <td><div style="display:flex;align-items:center;gap:8px;">
                    <div class="proj-thumb">${p.image_url ? `<img src="${BACKEND_URL}${p.image_url}">` : ''}</div>
                    <div style="font-weight:600;font-size:13px;">${p.title}</div>
                </div></td>
                <td>${p.category}</td>
                <td>${p.location || 'N/A'}</td>
                <td><span class="badge ${p.is_featured ? 'amber' : 'gray'}">${p.is_featured ? 'Featured' : 'Standard'}</span></td>
                <td>${new Date(p.createdAt).toLocaleDateString()}</td>
                <td><span class="taction" title="Delete" onclick="handleDeleteProject('${p._id}')"><i class="fas fa-trash" style="color:var(--red);"></i></span></td>
                <td><span class="taction" title="Edit" onclick="handleEditProject('${p._id}')"><i class="fas fa-pen" style="color:var(--info);"></i></span></td>
            </tr>`;
        });
    } catch (err) { console.error(err); }
}

async function loadTeam() {
    try {

        const data = await api('/api/team');
        const tb = document.getElementById('teamTableBody');
        tb.innerHTML = '';
        if (!data.data) return;

        data.data.forEach(m => {
            tb.innerHTML += `
            <tr>
             <td><div style="display:flex;align-items:center;gap:8px;">
                    <div class="proj-thumb">${m.image_url ? `<img src="${BACKEND_URL}${m.image_url}">` : ''}</div>
                </div></td>
                <td><strong>${m.name}</strong></td>
                <td>${m.position}</td>
                <td style="font-size:12px;color:var(--text-dim);">${m.email || 'N/A'}</td>
                 <td>
                    <span class="taction" title="Delete" onclick="handleDeleteMember('${m._id}')"><i class="fas fa-trash" style="color:var(--danger);"></i></span>
                </td>
                <td>
                    <span class="taction" title="Edit" onclick="openEditMember('${m._id}')"><i class="fas fa-pen" style="color:var(--info);"></i></span>
                </td>
            </tr>`;
        });
    } catch (err) { console.error(err); }
}

let editingMemberId = null;

async function openEditMember(id) {
    editingMemberId = id;
    document.getElementById('modal-member-title').innerText = 'EDIT TEAM MEMBER';
    document.querySelector('#btn-submit-member').innerHTML = '<i class="fas fa-save"></i> Update Member';

    try {
        const data = await api(`/api/team/${id}`);
        const m = data.data;

        document.getElementById('tm_name').value = m.name || '';
        document.getElementById('tm_position').value = m.position || '';
        document.getElementById('tm_email').value = m.email || '';
        document.getElementById('tm_bio').value = m.bio || '';
        document.getElementById('tm_phone').value = m.phone || '';

        const img = document.querySelector('#tm-imagePreview img')

        if (m.image_url) {
            img.src = `${BACKEND_URL}${m.image_url}`;
            img.style.display = 'block';
        } else {
            img.style.display = 'none'
            document.getElementById('tm_image').value = '';
        }

        openModal('teamMember');
    } catch (err) {
        toast('Failed to load member data.', 'error');
    }
}

function openAddMember() {
    editingMemberId = null;
    document.getElementById('modal-member-title').innerText = 'ADD TEAM MEMBER';
    document.querySelector('#btn-submit-member').innerHTML = '<i class="fas fa-plus"></i> Add Member';

    document.getElementById('tm_name').value = '';
    document.getElementById('tm_position').value = '';
    document.getElementById('tm_email').value = '';
    document.getElementById('tm_bio').value = '';
    document.getElementById('tm_phone').value = '';
    document.getElementById('tm_image').value = '';
    document.querySelector('#tm-imagePreview img').style.display = 'none';

    openModal('teamMember')
}

async function handleSaveMember() {
    const btn = document.getElementById('btn-submit-member');
    const name = document.getElementById('tm_name').value.trim();

    if (!name) {
        toast('Member name is required', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const fd = new FormData();
    fd.append('name', name);
    fd.append('position', document.getElementById('tm_position').value);
    fd.append('bio', document.getElementById('tm_bio').value);
    fd.append('email', document.getElementById('tm_email').value);
    fd.append('phone', document.getElementById('tm_phone').value);

    const imageInput = document.getElementById('tm_image');
    if (imageInput.files[0]) {
        fd.append('image', imageInput.files[0])
    }

    try {
        let data;
        if (editingMemberId) {
            data = await api(`/api/team/${editingMemberId}`, { method: 'PUT', body: fd })
        } else {
            data = await api('/api/team', { method: 'POST', body: fd });
        }

        if (data.success) {
            toast(editingMemberId ? 'Member Updated' : 'Member Added', 'success')
            closeModal('teamMember');
            loadTeam();
            document.getElementById('tm_name').value = '';
            document.getElementById('tm_position').value = '';
            document.getElementById('tm_bio').value = '';
            document.getElementById('tm_email').value = '';
            document.getElementById('tm_phone').value = '';
            document.getElementById('tm_image').value = '';
            document.querySelector('#tm-imagePreview img').style.display = 'none';
        } else {
            toast(data.message || 'Failed to save.', 'error');
        }
    } catch (err) {
        toast('Failed to save member.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = editingMemberId ? '<i class="fas fa-save"></i> Update Member' : '<i class="fas fa-plus"></i> Add Member';
    }
}

async function handleDeleteMember(id) {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
        await api(`/api/team/${id}`, { method: 'DELETE' })
        toast('Member deleted', 'success')
        loadTeam()
    } catch (err) {
        toast('Delete failed', 'error')
    }
}

/* ============== SERVICES LOGIC ===================== */
async function loadServices() {
    try {
        const data = await api('/api/services');
        const tb = document.getElementById('serviceTableBody');
        tb.innerHTML = '';

        if (!data.data || data.data.length === 0) {
            tb.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-dim);padding:40px;">No services found.</td></tr>';
        } else {
            data.data.forEach(s => {
                tb.innerHTML += `
                  <tr>
                      <td><strong>${s.title}</strong></td>
                      <td style="font-size:13px;color:var(--text-dim);max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.description}</td>
                      <td><span class="badge ${s.is_active ? 'green' : 'gray'}">${s.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td><span class="taction" title="Delete" onclick="handleDeleteService('${s._id}')"><i class="fas fa-trash" style="color:var(--danger);"></i></span></td> 
                      <td><span class="taction" title="Edit" onclick="handleEditService('${s._id}')"><i class="fas fa-edit" style="color:var(--primary);"></i></span></td>
                  </tr>`
            })
        }
    } catch (err) {
        toast('Error Loading services', 'error');
    }
}

async function handleCreateService() {
    const btn = document.getElementById('btn-create-service');
    const title = document.getElementById('ns_title').value.trim();

    if (!title) { toast('Service title is required', 'error'); return; }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    try {
        let data;
        if (editingServiceId) {
            data = await api(`/api/services/${editingServiceId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: title,
                    description: document.getElementById('ns_desc').value,
                    icon_class: document.getElementById('ns_icon').value
                })
            });
        } else {
            data = await api('/api/services', {
                method: 'POST',
                body: JSON.stringify({
                    service_number: parseInt(document.getElementById('ns_number').value),
                    title: title,
                    description: document.getElementById('ns_desc').value,
                    icon_class: document.getElementById('ns_icon').value
                })
            });
        }

        if (data.success) {
            toast(editingServiceId ? 'Service updated!' : 'Service created!', 'success');
            closeModal('newService');
            loadServices();
            editingServiceId = null;
            document.getElementById('service-modal-title').innerText = 'NEW SERVICE';
            document.getElementById('btn-create-service').innerHTML = '<i class="fas fa-plus"></i> Create Service';
            document.getElementById('ns_number').value = '';
            document.getElementById('ns_title').value = '';
            document.getElementById('ns_desc').value = '';
        } else {
            toast(data.message || 'Failed to save', 'error');
        }
    } catch (err) {
        toast('Failed to save service.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = editingServiceId ? '<i class="fas fa-save"></i> Update Service' : '<i class="fas fa-plus"></i> Create Service';
    }
}

let editingServiceId = null;
async function handleEditService(id) {
    editingServiceId = id;
    document.getElementById('ns_title_text').innerText = 'EDIT SERVICE'
    document.getElementById('btn-create-service').innerHTML = '<i class="fas fa-save"></i> Update Service';

    try {
        const data = await api(`/api/services/${id}`);
        const s = data.data;
        document.getElementById('ns_number').value = s.service_number || '';
        document.getElementById('ns_title').value = s.title || '';
        document.getElementById('ns_desc').value = s.description || ''
        openModal('newService');
    } catch (err) {
        toast('Failed to load service', 'error');
    }
}

async function handleDeleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
        await api(`/api/services/${id}`, { method: 'DELETE' });
        toast('Service deleted', 'success')
        loadServices();
        loadDashboard();
    } catch (err) {
        toast('Failed to delete service', 'error');
    }
}

// ==========================================
// ACTION HANDLERS (CRUD - PROJECTS)
// ==========================================

async function handleCreateProject() {
    const btn = document.getElementById('create-new-project-btn');
    if (btn.disabled) return;

    const title = document.getElementById('np_title').value.trim();
    if (!title) { toast('Project title is required', 'error'); return; }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const fd = new FormData();
    fd.append('title', title);
    fd.append('category', document.getElementById('np-cat').value);
    fd.append('location', document.getElementById('np-location').value);
    fd.append('description', document.getElementById('np-desc').value);
    fd.append('is_featured', document.getElementById('np-featured').checked);

    const imageInput = document.getElementById('np_image');
    if (imageInput.files[0]) { fd.append('image', imageInput.files[0]); }

    try {
        let data;
        if (editingProjectId) {
            data = await api(`/api/projects/${editingProjectId}`, { method: 'PUT', body: fd });
        } else {
            data = await api('/api/projects', { method: 'POST', body: fd });
        }

        if (data.success) {
            toast(editingProjectId ? 'Project updated successfully!' : 'Project created successfully!', 'success');
            closeModal('newProject');
            loadProjects();
            loadDashboard();
            document.getElementById('np_title').value = '';
            document.getElementById('np-location').value = '';
            document.getElementById('np-desc').value = '';
            document.getElementById('np_image').value = '';
            document.getElementById('np-featured').checked = false;
            document.querySelector('#imagePreview img').style.display = 'none';
            editingProjectId = null;
        } else {
            toast(data.message || 'Failed to save project', 'error');
        }
    } catch (err) {
        toast('Failed to save project.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = editingProjectId ? '<i class="fas fa-save"></i> Update Project' : '<i class="fas fa-plus"></i> Create Project';
    }
}

async function handleDeleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
        await api(`/api/projects/${id}`, { method: 'DELETE' });
        toast('Project deleted', 'success');
        loadProjects();
        loadDashboard();
    } catch (err) {
        toast('Delete failed', 'error');
    }
}

let editingProjectId = null;

async function handleEditProject(id) {
    editingProjectId = id;
    document.querySelector('#modal-proj-title h3').innerText = 'EDIT PROJECT';
    document.querySelector('#create-new-project-btn').innerHTML = '<i class="fas fa-save"></i> Update Project';

    try {
        const data = await api(`/api/projects/${id}`);
        const p = data.data || data;

        if (!p) { toast('Project data not found', 'error'); return; }

        document.getElementById('np_title').value = p.title || '';
        document.getElementById('np-cat').value = p.category || '';
        document.getElementById('np-location').value = p.location || '';
        document.getElementById('np-desc').value = p.description || '';
        document.getElementById('np-featured').checked = p.is_featured || false;

        const img = document.querySelector('#imagePreview img');
        if (p.image_url) {
            img.src = `${BACKEND_URL} ${p.image_url}`;
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
            document.getElementById('np_image').value = '';
        }
        openModal('newProject');
    } catch (err) {
        toast('Failed to load project', 'error');
    }
}

async function handleSaveSettings() {
    toast('Saving settings...', 'info');
    try {
        await api('/api/about', {
            method: 'PUT',
            body: JSON.stringify({
                headline: document.getElementById('set-headline').value,
                main_description: document.getElementById('set-desc').value,
                mission_statement: document.getElementById('set-mission').value,
                vision_statement: document.getElementById('set-vision').value
            })
        });
        toast('Settings saved successfully!', 'success');
    } catch (err) {
        toast('Failed to save settings.', 'error');
    }
}

// ==========================================
// UI LOGIC & ROUTING
// ==========================================

function nav(id, el) {
    document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));
    const v = document.getElementById('v-' + id);
    if (v) v.classList.add('active');

    document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
    if (el) el.classList.add('active');

    if (window.innerWidth < 900) document.getElementById('sidebar').classList.remove('mob-open');

    if (id === 'projects') loadProjects();
    if (id === 'team') loadTeam();
    if (id === 'services') loadServices();
    if (id === 'Messages') loadMessages();
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('mob-open'); }

function openModal(id) { document.getElementById('model-' + id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById('model-' + id).classList.remove('open'); document.body.style.overflow = ''; }

function closeNewProjectModal() {
    document.querySelectorAll('.model-back').forEach(b => { b.classList.remove('open'); document.body.style.overflow = ''; })
}

document.querySelectorAll('.model-back').forEach(b => { b.addEventListener('click', e => { if (e.target === b) { b.classList.remove('open'); document.body.style.overflow = ''; } }); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.querySelectorAll('.model-back.open').forEach(m => { m.classList.remove('open'); document.body.style.overflow = ''; }); } });
document.querySelector('.logOut').addEventListener('click', logout);

// --- IMAGE PREVIEW LOGIC ---
const imageInput = document.getElementById('np_image');
if (imageInput) {
    imageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) { const img = document.querySelector('#imagePreview img'); img.src = e.target.result; img.style.display = 'block'; }
            reader.readAsDataURL(file);
        } else { document.querySelector('#imagePreview img').style.display = 'none'; }
    });
}

const teamImageInput = document.getElementById('tm_image');
if (teamImageInput) {
    teamImageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) { const img = document.querySelector('#tm-imagePreview img'); img.src = e.target.result; img.style.display = 'block'; }
            reader.readAsDataURL(file);
        } else { document.querySelector('#tm-imagePreview img').style.display = 'none'; }
    });
}

// ==========================================
// NOTIFICATIONS
// ==========================================
async function loadNotifications() {
    try {
        const data = await api(`/api/notifications`)
        const badge = document.getElementById('notifBadge')
        const list = document.getElementById('notifList')

        if (!badge || !list) return;

        if (data.unreadCount > 0) { badge.textContent = data.unreadCount; badge.style.display = 'flex'; }
        else { badge.style.display = 'none' }

        list.innerHTML = ''
        if (data.data.length === 0) { list.innerHTML = '<li style="text-align:center; padding:20px; color:var(--text-dim);">No notifications yet</li>'; return; }

        data.data.forEach(n => {
            const iconClass = n.type === 'registration' ? 'fa-user-plus' : 'fa-envelope';
            list.innerHTML += `
            <li class="${n.is_read ? '' : 'unread'}" onclick="markRead('${n.id}', this);viewMessageFromNotif('${n.type}')">
                    <i class="fas ${iconClass} notif-icon"></i>
                    <div class="notif-content">
                        <div class="notif-text">${n.message}</div>
                    </div>
                </li>`;
        });
    } catch (error) { console.error('Failed to load notifications', error) }
}

function viewMessageFromNotif(type) {
    document.getElementById('notifDropdown').style.display = 'none';
    if (type === 'message') {
        const msgLink = document.querySelector('[onclick*="Messages"]');
        if (msgLink) msgLink.click();
    }
}

function toggleNotifPanel() {
    const panel = document.getElementById('notifDropdown');
    if (panel.style.display === 'none') { panel.style.display = 'block'; loadNotifications(); }
    else { panel.style.display = 'none'; }
}

async function markRead(id, element) {
    try {
        await api(`/api/notifications/mark-read/${id}`, { method: 'PUT' });
        element.classList.remove('unread')
        const badge = document.getElementById('notifBadge');
        let count = parseInt(badge.textContent) - 1;
        if (count <= 0) { badge.style.display = 'none' } else { badge.textContent = count }
    } catch (err) { console.error('Failed to mark read', err); }
}

async function markAllRead() {
    try { await api('/api/notifications/mark-all-read', { method: 'PUT' }); loadNotifications(); }
    catch (err) { console.log("Failed to mark all read", err) }
}

const currentRole = localStorage.getItem('sh_role')
if (token && (currentRole === 'super_admin' || currentRole === 'editor')) {
    loadNotifications()
    setInterval(loadNotifications, 300000); // load every 5mins      
}

// ==========================================
// MESSAGES
// ==========================================
async function loadMessages() {
    try {
        const data = await api('/api/messages');
        const tableBody = document.getElementById('msgTableBody');
        tableBody.innerHTML = '';
        document.getElementById('msg-subtitle').textContent = `${data.count} Messages`

        if (data.data && data.data.length == 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-dim);">No Messages yet</td></tr>'
            return
        }

        data.data.forEach(m => {
            tableBody.innerHTML += `
            <tr>
                <td><strong>${m.name}</strong></td>
                <td style="font-size:13px;">
                    ${m.email}<br>
                    ${m.phone_number || 'N/A'}
                </td>
                <td style="max-width:300px; font-size:13px; color:var(--text-dim);">${m.body}</td>
                <td style="font-size:12px; color:var(--text-dim);">${new Date(m.createdAt).toLocaleDateString()}</td>
                <td>
                    <span class="taction" title="Delete" onclick="handleDeleteMessage('${m._id}')">
                        <i class="fas fa-trash" style="color:var(--danger);"></i>
                    </span>
                </td>
            </tr>`;
        })
    } catch (err) { alert('failed to load Message', err) }
}

async function handleDeleteMessage(id) {
    if (!confirm('Delete this message')) return
    try {
        await api(`/api/messages/${id}`, { method: 'DELETE' })
        toast('Message Deleted', 'success')
        loadMessages()
    } catch (err) { toast('Delete Failed', err); }
}
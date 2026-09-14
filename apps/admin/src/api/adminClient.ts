const ENV_API_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
const API_BASE = ENV_API_URL ? `${ENV_API_URL}/api` : '/api';

function getHeaders() {
  const token = localStorage.getItem('queueless_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function adminLogin(credentials: any) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Login failed');
  return data;
}

export async function fetchDashboardData() {
  const res = await fetch(`${API_BASE}/admin/dashboard`, { headers: getHeaders() });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to fetch dashboard (HTTP ${res.status})`);
  }
  return data;
}

export async function fetchOrders(params: any = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/admin/orders?${query}`, { headers: getHeaders() });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to fetch orders (HTTP ${res.status})`);
  }
  return data;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to update status (HTTP ${res.status})`);
  }
  return data;
}

export async function confirmCashPayment(orderId: string) {
  const res = await fetch(`${API_BASE}/admin/orders/${orderId}/cash-confirm`, {
    method: 'POST',
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to confirm payment (HTTP ${res.status})`);
  }
  return data;
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/admin/products`, { headers: getHeaders() });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to fetch products (HTTP ${res.status})`);
  }
  return data;
}

export async function createProduct(payload: any) {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to create product (HTTP ${res.status})`);
  }
  return data;
}

export async function updateProduct(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to update product (HTTP ${res.status})`);
  }
  return data;
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/admin/categories`, { headers: getHeaders() });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to fetch categories (HTTP ${res.status})`);
  }
  return data;
}

export async function createCategory(payload: any) {
  const res = await fetch(`${API_BASE}/admin/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to create category (HTTP ${res.status})`);
  }
  return data;
}

export async function updateCategory(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to update category (HTTP ${res.status})`);
  }
  return data;
}

export async function deleteCategory(id: string) {
  const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to delete category (HTTP ${res.status})`);
  }
  return data;
}

export async function fetchCounters() {
  const res = await fetch(`${API_BASE}/admin/counters`, { headers: getHeaders() });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to fetch counters (HTTP ${res.status})`);
  }
  return data;
}

export async function fetchStaff() {
  const res = await fetch(`${API_BASE}/admin/staff`, { headers: getHeaders() });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to fetch staff (HTTP ${res.status})`);
  }
  return data;
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE}/admin/audit-logs`, { headers: getHeaders() });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to fetch audit logs (HTTP ${res.status})`);
  }
  return data;
}

export async function fetchCounterOrders(counterId: string) {
  const res = await fetch(`${API_BASE}/counter/${counterId}/orders`, { headers: getHeaders() });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to fetch counter orders (HTTP ${res.status})`);
  }
  return data;
}

export async function updateCounterTicketStatus(counterId: string, ticketId: string, status: string) {
  const res = await fetch(`${API_BASE}/counter/${counterId}/tickets/${ticketId}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Failed to update counter ticket (HTTP ${res.status})`);
  }
  return data;
}

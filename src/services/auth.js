/**
 * Utility auth client-side.
 * Token disimpan di localStorage; semua request API
 * otomatis membawa header Authorization via api.js.
 */

export const auth = {
  getToken:  ()      => localStorage.getItem('sangia_token'),
  getUser:   ()      => {
    try { return JSON.parse(localStorage.getItem('sangia_user') ?? 'null'); }
    catch { return null; }
  },
  isLoggedIn: ()     => !!localStorage.getItem('sangia_token'),
  logout:    ()      => {
    localStorage.removeItem('sangia_token');
    localStorage.removeItem('sangia_user');
    window.location.href = '/';
  },
  setSession: (token, user) => {
    localStorage.setItem('sangia_token', token);
    if (user) localStorage.setItem('sangia_user', JSON.stringify(user));
  },
};

export default auth;

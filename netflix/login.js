// Basic regex validation, no real auth.
const form = document.getElementById('login-form');
const emailPhoneInput = document.getElementById('emailPhone');
const passwordInput = document.getElementById('password');
const emailHelp = document.getElementById('emailHelp');
const passHelp = document.getElementById('passHelp');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // simple email
const phoneRegex = /^\+?\d{10,15}$/; // digits with optional leading +, 10-15 long
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; // min 6, letters & numbers

function show(msgEl, msg) {
  msgEl.textContent = msg || '';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;

  const v = emailPhoneInput.value.trim();
  if (!emailRegex.test(v) && !phoneRegex.test(v)) {
    show(emailHelp, 'Enter a valid email (e.g. user@example.com) or phone (+12345678901).');
    ok = false;
  } else {
    show(emailHelp, '');
  }

  const p = passwordInput.value;
  if (!passwordRegex.test(p)) {
    show(passHelp, 'Password must be 6+ chars and include at least one letter and one number.');
    ok = false;
  } else {
    show(passHelp, '');
  }

  if (!ok) return;

  // "Login" success: store minimal session and go to home
  localStorage.setItem('nf_user', JSON.stringify({ id: Date.now(), handle: v }));
  window.location.href = 'home.html';
});

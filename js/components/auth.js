/**
 * Authentication Views (Login, Signup, Forgot Password, OTP Reset)
 */

window.renderAuth = function(route) {
  if (route === "signup") return renderSignupView();
  if (route === "forgot-password") return renderForgotPasswordView();
  if (route === "otp-reset") return renderOTPResetView();
  return renderLoginView();
};

function renderLoginView() {
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <span class="brand-badge">IMS</span>
          <span style="font-weight: 700; color: var(--text-main);">Inventory System</span>
        </div>
        <h2 class="auth-title">Sign In</h2>
        <p class="auth-subtitle">Enter your details to access your warehouse dashboard.</p>

        <form onsubmit="window.handleAuthLogin(event)">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="login-email" class="form-control" style="width: 100%;" value="admin@ims.com" required>
          </div>

          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label class="form-label">Password</label>
              <a href="#forgot-password" style="font-size: 12px; color: var(--primary); text-decoration: none;">Forgot password?</a>
            </div>
            <input type="password" id="login-password" class="form-control" style="width: 100%;" value="password123" required>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 8px;">
            Sign In to IMS
          </button>
        </form>

        <div style="text-align: center; margin-top: 20px; font-size: 13px; color: var(--text-muted);">
          Don't have an account? <a href="#signup" style="color: var(--primary); font-weight: 600; text-decoration: none;">Sign up</a>
        </div>
      </div>
    </div>
  `;
}

function renderSignupView() {
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2 class="auth-title">Create Account</h2>
        <p class="auth-subtitle">Register staff or warehouse manager profile.</p>

        <form onsubmit="window.handleAuthSignup(event)">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="signup-name" class="form-control" style="width: 100%;" placeholder="e.g. John Doe" required>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="signup-email" class="form-control" style="width: 100%;" placeholder="john@company.com" required>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="signup-password" class="form-control" style="width: 100%;" required>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 8px;">
            Create Account
          </button>
        </form>

        <div style="text-align: center; margin-top: 20px; font-size: 13px; color: var(--text-muted);">
          Already have an account? <a href="#login" style="color: var(--primary); font-weight: 600; text-decoration: none;">Sign in</a>
        </div>
      </div>
    </div>
  `;
}

function renderForgotPasswordView() {
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2 class="auth-title">Reset Password</h2>
        <p class="auth-subtitle">Enter your email to receive an OTP verification code.</p>

        <form onsubmit="window.handleForgotPassword(event)">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="reset-email" class="form-control" style="width: 100%;" value="admin@ims.com" required>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 8px;">
            Send OTP Code
          </button>
        </form>

        <div style="text-align: center; margin-top: 20px; font-size: 13px;">
          <a href="#login" style="color: var(--text-muted); text-decoration: none;">← Back to Sign In</a>
        </div>
      </div>
    </div>
  `;
}

function renderOTPResetView() {
  return `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2 class="auth-title">Enter OTP Code</h2>
        <p class="auth-subtitle">We sent a 6-digit OTP to your registered email.</p>

        <form onsubmit="window.handleOTPReset(event)">
          <div class="form-group">
            <label class="form-label">6-Digit OTP Code</label>
            <input type="text" id="otp-code" class="form-control" style="width: 100%; font-size: 18px; letter-spacing: 4px; text-align: center;" value="482910" maxlength="6" required>
          </div>

          <div class="form-group">
            <label class="form-label">New Password</label>
            <input type="password" id="otp-new-password" class="form-control" style="width: 100%;" placeholder="Enter new password" required>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 8px;">
            Update Password
          </button>
        </form>

        <div style="text-align: center; margin-top: 20px; font-size: 13px;">
          <a href="#login" style="color: var(--text-muted); text-decoration: none;">← Back to Sign In</a>
        </div>
      </div>
    </div>
  `;
}

// Handlers
window.handleAuthLogin = function(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-password").value;
  try {
    window.imsStore.login(email, pass);
    window.imsToast.show("Welcome back!");
    window.imsRouter.navigate("dashboard");
  } catch (err) {
    window.imsToast.show(err.message, "danger");
  }
};

window.handleAuthSignup = function(e) {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const pass = document.getElementById("signup-password").value;

  window.imsStore.data.currentUser = {
    name: name,
    email: email,
    role: "Warehouse Operations Staff",
    warehouse: "wh-main"
  };
  window.imsStore.saveState();
  window.imsToast.show("Account created successfully!");
  window.imsRouter.navigate("dashboard");
};

window.handleForgotPassword = function(e) {
  e.preventDefault();
  window.imsToast.show("OTP sent to your email address!");
  window.imsRouter.navigate("otp-reset");
};

window.handleOTPReset = function(e) {
  e.preventDefault();
  window.imsToast.show("Password updated successfully! Please sign in.");
  window.imsRouter.navigate("login");
};

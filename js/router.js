/**
 * IMS Router - Hash based routing system
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;

    window.addEventListener("hashchange", () => this.handleRoute());
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRoute() {
    let hash = window.location.hash.slice(1) || "dashboard";
    
    // Auth check
    const user = window.imsStore.getCurrentUser();
    if (!user && !["login", "signup", "forgot-password", "otp-reset"].includes(hash)) {
      this.navigate("login");
      return;
    }

    if (user && ["login", "signup", "forgot-password", "otp-reset"].includes(hash)) {
      this.navigate("dashboard");
      return;
    }

    const handler = this.routes[hash] || this.routes["dashboard"];
    this.currentRoute = hash;
    
    if (handler) {
      handler(hash);
    }
  }

  init() {
    this.handleRoute();
  }
}

window.imsRouter = new Router();

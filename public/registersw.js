/**
 * List of hostnames that are allowed to run service workers on http:
 */
const swAllowedHostnames = ["localhost", "127.0.0.1"];

/**
 * Utility function to check the environment and register the service worker
 */
async function registerServiceWorker() {
  try {
    console.log("Starting service worker registration...");

    if (!isServiceWorkerRegistrationAllowed()) {
      throw new Error("Service workers can only be registered over HTTPS or on localhost.");
    }

    if (!navigator.serviceWorker) {
      throw new Error("Your browser doesn't support service workers. Please upgrade to a modern browser.");
    }

    await navigator.serviceWorker.register('sw.js', {
      scope: __uv$config.prefix, 
    });

    console.log("Service worker registered successfully!");
  } catch (error) {
    console.error("Service worker registration failed:", error.message);
    alert("Service Worker registration failed. " + error.message);
  }
}

/**
 * Check if the current protocol and hostname are valid for service worker registration
 */
function isServiceWorkerRegistrationAllowed() {
  const isHttp = location.protocol !== "https:";
  const isLocalhost = swAllowedHostnames.includes(location.hostname);
  return !isHttp || isLocalhost;
}

registerServiceWorker();
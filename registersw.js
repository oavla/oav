/**
 * List of hostnames that are allowed to run serviceworkers on http:
 */
const swAllowedHostnames = ["localhost", "127.0.0.1"];
const dnsResolver = "8.8.8.8"; // Google Public DNS

/**
 * Global util
 * Used in 404.html and index.html
 */
async function registerSW() {
  toasty.info("Starting registration...");

  // Log the hostname or bare server environment
  console.log("Current server: " + location.hostname);

  if (
    location.protocol !== "https:" &&
    !swAllowedHostnames.includes(location.hostname)
  )
    throw new Error("Service workers cannot be registered without https.");

  if (!navigator.serviceWorker)
    throw new Error("Your browser doesn't support service workers.");

  try {
    // Ultraviolet has a stock `sw.js` script.
    const registration = await navigator.serviceWorker.register('sw.js', {
      scope: __uv$config.prefix,
    });

    // Extract the scope from the URL
    const scope = new URL(registration.scope).pathname;

    // Check if service worker registration was successful
    if (registration) {
      toasty.success("Successfully registered service worker with scope: " + scope);
    } else {
      toasty.error("Failed to register service worker!");
    }
  } catch (error) {
    toasty.error("Error registering service worker: " + error.message);
  }
}

window.addEventListener('load', registerSW);

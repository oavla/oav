document.addEventListener('DOMContentLoaded', function() {
  const storedTitle = localStorage.getItem('siteTitle');
  if (storedTitle) {
    document.title = storedTitle;
  }

  const storedFaviconURL = localStorage.getItem('faviconURL');
  if (storedFaviconURL) {
    updateFavicon(storedFaviconURL);
  }

  console.log("Automask fired.");

  let inFrame;

  try {
    inFrame = window !== top;
  } catch (e) {
    inFrame = true;
  }

  if (inFrame) {
    console.log("Already in an iframe. Exiting...");
    return;
  }

  const defaultTitle = "Home | Schoology";
  const defaultIcon = "https://bisd.schoology.com/sites/all/themes/schoology_theme/favicon.ico";

  const title = localStorage.getItem("siteTitle") || defaultTitle;
  const icon = localStorage.getItem("faviconURL") || defaultIcon;

  const iframeSrc = "index.html";
  const popup = window.open("", "_blank");

  if (!popup || popup.closed) {
    alert("Failed to load mask. Please allow popups and try again.");
    return;
  }

  popup.document.head.innerHTML = `<title>${title}</title><link rel="icon" href="${icon}">`;
  popup.document.body.innerHTML = `<iframe style="height: 100%; width: 100%; border: none; position: fixed; top: 0; right: 0; left: 0; bottom: 0;" src="${iframeSrc}">`;

  window.location.replace("https://bisd.schoology.com/");
  console.log("Automask loaded.");
});

function updateFavicon(favIconUrl) {
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = favIconUrl;
  document.getElementsByTagName('head')[0].appendChild(link);
}

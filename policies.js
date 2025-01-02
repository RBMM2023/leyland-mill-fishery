// Load the modal content from popupModal.html
function loadModal() {
  fetch('popupModal.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('modalContainer').innerHTML = data;

      const userConsent = getCookie('cookieConsent');
      if (userConsent === 'accepted') {
        loadAdSenseScript(); // Load AdSense if consent is already given
      } else {
        // Show the modal if no consent or if the user rejected cookies
        showCookieModal();
      }

      document
        .getElementById('acceptCookies')
        .addEventListener('click', function () {
          setCookie('cookieConsent', 'accepted', 365); // Set 'accepted' for 1 year
          loadAdSenseScript(); // Load AdSense script upon acceptance
          hideCookieModal();
        });

      document
        .getElementById('rejectCookies')
        .addEventListener('click', function () {
          // Set 'rejected' but modal will reappear on refresh
          setCookie('cookieConsent', 'rejected', 1); // Optional: Set short expiration
          removeAdSenseScript(); // Remove AdSense if user rejects cookies
          hideCookieModal();
        });
    })
    .catch((error) => console.error('Error loading modal:', error));
}

// Function to dynamically load AdSense script
function loadAdSenseScript() {
  if (!document.getElementById('adsenseScript')) {
    const script = document.createElement('script');
    script.id = 'adsenseScript';
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8645132554046923';
    script.crossOrigin = 'anonymous';
    script.async = true;
    document.head.appendChild(script);
  }
}

// Function to dynamically remove AdSense script
function removeAdSenseScript() {
  const adsenseScript = document.getElementById('adsenseScript');
  if (adsenseScript) {
    adsenseScript.remove();
  }
}

// Function to set cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Function to get cookie
function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Show and hide modal functions
function showCookieModal() {
  const modal = document.getElementById('cookieModal');
  modal.style.display = 'flex';
}

function hideCookieModal() {
  const modal = document.getElementById('cookieModal');
  modal.style.display = 'none';
}

// Load the modal when the page loads
window.onload = loadModal;

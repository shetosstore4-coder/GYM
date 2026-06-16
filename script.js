let currentOpenPageId = null;

// Routing Controller Logic
function navigateTo(pageId) {
    document.getElementById('main-dashboard').classList.add('hidden');
    
    const innerViews = document.querySelectorAll('.sub-page');
    innerViews.forEach(view => view.classList.add('hidden'));

    const activeView = document.getElementById(pageId);
    if (activeView) {
        activeView.classList.remove('hidden');
        currentOpenPageId = pageId;
        window.scrollTo(0, 0);
    }
}

function navigateBack() {
    if (currentOpenPageId) {
        document.getElementById(currentOpenPageId).classList.add('hidden');
        document.getElementById('main-dashboard').classList.remove('hidden');
        currentOpenPageId = null;
        resetNavHighlight();
    }
}

// Exercise Pattern Dialogs
function openModal(dotsPattern) {
    const modal = document.getElementById('global-modal');
    document.getElementById('modal-dots').innerText = dotsPattern;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('global-modal').classList.remove('active');
}

// LocalStorage Weekly Tracking Functions
function openBodyMetricModal(weekNumber) {
    document.getElementById('metric-week-id').value = weekNumber;
    document.getElementById('body-modal-title').innerText = `قياسات الأسبوع ${weekNumber}`;
    
    const localHistory = localStorage.getItem(`week_metrics_${weekNumber}`);
    if (localHistory) {
        const dataset = JSON.parse(localHistory);
        document.getElementById('metric-height').value = dataset.height || '';
        document.getElementById('metric-weight').value = dataset.weight || '';
        document.getElementById('metric-fat').value = dataset.fat || '';
        document.getElementById('metric-muscle').value = dataset.muscle || '';
        document.getElementById('metric-bone').value = dataset.bone || '';
        document.getElementById('metric-bmr').value = dataset.bmr || '';
    } else {
        document.getElementById('body-metric-form').reset();
    }

    document.getElementById('body-metric-modal').classList.add('active');
}

function closeBodyMetricModal() {
    document.getElementById('body-metric-modal').classList.remove('active');
}

function saveBodyMetrics(event) {
    event.preventDefault();
    const selectedWeek = document.getElementById('metric-week-id').value;
    
    const clientMetrics = {
        height: document.getElementById('metric-height').value,
        weight: document.getElementById('metric-weight').value,
        fat: document.getElementById('metric-fat').value,
        muscle: document.getElementById('metric-muscle').value,
        bone: document.getElementById('metric-bone').value,
        bmr: document.getElementById('metric-bmr').value
    };

    localStorage.setItem(`week_metrics_${selectedWeek}`, JSON.stringify(clientMetrics));
    alert(`تم حفظ قياسات الأسبوع ${selectedWeek} بنجاح!`);
    closeBodyMetricModal();
}

// Accessibilities Global Keyboards Hooks
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeBodyMetricModal();
    }
});

// ------------------------------------------------------------------ */
// SCALABLE GLOWING TABS CONTROLLERS ENGINE                           */
// ------------------------------------------------------------------ */
function inverseMousePosition(element, event) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {
        x1: -(x - rect.width / 2) / 20,
        y1: -(y - rect.height / 2) / 20
    };
}

function syncNavIndicator(targetElement) {
    const nav = document.querySelector('.nav');
    const targetLi = targetElement.parentNode;
    
    // Safety exit rule: Skip coordinate parsing if layout switches to a vertical stack list structure
    if (window.innerWidth <= 520) {
        [...nav.querySelectorAll('li')].map(link => link.classList.remove('active'));
        targetLi.classList.add('active');
        return;
    }
    
    // Scalable calculation relative coordinate tracking map mapping
    const navRect = nav.getBoundingClientRect();
    const liRect = targetLi.getBoundingClientRect();
    
    const width = liRect.width;
    const offsetLeft = liRect.left - navRect.left;

    [...nav.querySelectorAll('li')].map(link => link.classList.remove('active'));
    targetLi.classList.add('active');

    nav.style.setProperty('--after-bg-position', offsetLeft);
    nav.style.setProperty('--after-radial-bg-position', offsetLeft + (width / 2));
    nav.style.setProperty('--after-bg-width', width);
}

function resetNavHighlight() {
    let activeLink = document.getElementById('home');
    if (currentOpenPageId === 'page-about-program') {
        activeLink = document.getElementById('about');
    } else if (currentOpenPageId === 'page-body-tracking') {
        activeLink = document.getElementById('body');
    }
    if (activeLink) syncNavIndicator(activeLink);
}

function handleTabRouting(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute('id');
    syncNavIndicator(event.target);
    
    if (targetId === 'home') {
        const innerViews = document.querySelectorAll('.sub-page');
        innerViews.forEach(view => view.classList.add('hidden'));
        document.getElementById('main-dashboard').classList.remove('hidden');
        currentOpenPageId = null;
    } else if (targetId === 'about') {
        navigateTo('page-about-program');
    } else if (targetId === 'body') {
        navigateTo('page-body-tracking');
    }
}

// Initializations Hooks
const tabsNav = document.querySelector('.nav');
const links = tabsNav.querySelectorAll('li a');

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', handleTabRouting);
    links[i].addEventListener("mousemove", (event) => {
        const tilt = inverseMousePosition(event.target, event);
        tabsNav.style.setProperty("--tilt-bg-y", tilt.x1 * 2);
        tabsNav.style.setProperty("--tilt-bg-x", tilt.y1 * 2);
    });
}

// Dynamic real-time listeners for resize scaling safety recalculations 
window.addEventListener('resize', resetNavHighlight);
document.addEventListener('DOMContentLoaded', resetNavHighlight);
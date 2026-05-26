
var BACKEND_URL = "https://white-eangles-contructor.onrender.com"

document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    loadFeaturedProjects();
    loadAboutStats();
});


async function loadServices() {
    try {

        const res = await fetch(`${BACKEND_URL}/api/services`);
        const data = await res.json();

        const servicesSection = document.querySelector(".services");


        if (!servicesSection) return;
        if (!data.data || data.data.length === 0) {
            servicesSection.innerHTML = '<p>No services found.</p>';
            return;
        }

        servicesSection.innerHTML = `
        <div class="container">
            <div class="section-header">
                <h6>WHAT WE DO</h6>
                <h2>Our Core Services</h2>
            </div>
            <div class="services-grid">
                ${data.data.map(s => `
                    <div class="service-card">
                        <i class="fas ${s.icon_class || 'fa-wrench'}"></i>
                        <h3>${s.title}</h3>
                        <p>${s.description ? s.description.substring(0, 120) : ''}...</p>
                    </div>
                `).join('')}
            </div>
        </div>
        `;

    } catch (err) {
        console.error("Failed to load services:", err);
    }
}

async function loadFeaturedProjects() {
    try {

        const res = await fetch(`${BACKEND_URL}/api/projects`);
        const data = await res.json();

        const project = document.getElementById('projects');

        if (!project || !data.data || data.data.length === 0) return;

        project.innerHTML = `
            
                <div class="container">
                    <div class="section-header">
                        <h6>OUR PORTFOLIO</h6>
                        <h2>Featured Projects</h2>
                    </div>
                    <div class="projects-grid">
                        ${data.data.map(p => `
                            <div class="project-card">
                                <img src="${BACKEND_URL}${p.image_url}" alt="${p.title}">
                                <div class="project-info">
                                    <div class="project-location">
                                        <i class="fas fa-map-marker-alt"></i> ${p.location || 'Kenya'}
                                    </div>
                                    <h3>${p.title}</h3>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
           
        `;


    } catch (err) {
        console.error("Failed to load projects:", err);
    }
}

async function loadAboutStats() {
    try {

        const res = await fetch(`${BACKEND_URL}/api/about/main`);
        const data = await res.json();
        const about = document.getElementById('about');


        if (!about || !data.data) return;

        about.innerHTML = `
                <div class="container">
                    <div class="about-grid">
                        <div class="about-content">
                            <h6>WHO WE ARE</h6>
                            <h2>White Eagles Contractors</h2>
                            <p>${data.data.main_description || 'Amazing construction company.'}</p>
                        </div>
                        <div class="about-stats">
                            ${(data.data.company_stats || []).map(stat => `
                                <div class="stat-box">
                                    <h3>${stat.value}</h3>
                                    <p>${stat.label}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            
        `;


    } catch (err) {
        console.error("Failed to load about stats:", err);
    }
}
// Education Timeline Data
const educationData = [
    {
        title: 'Bachelor of Science in Computer Science',
        subtitle: 'University of Regina',
        dateStart: '2023-09-01',
        dateEnd: '2027-08-01',
        dateDisplay: 'Sep 2023 - Aug 2027 (Expected)',
        description: 'Currently pursuing a degree in Computer Science with focus on software development and programming.'
    }
];

// Projects Timeline Data - Empty for now, you can add later
const projectsData = [];

// Certifications Data - Empty for now, you can add later
const certificationsData = [];

// Generate Education Timeline
function generateEducationTimeline() {
    const timelineContainer = document.getElementById('timeline');
    
    educationData.forEach((item) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        timelineItem.innerHTML = `
            <div class="timeline-item-content">
                <div class="timeline-item-date">${item.dateDisplay}</div>
                <h3>${item.title}</h3>
                <p class="timeline-item-subtitle">${item.subtitle}</p>
                <p class="timeline-item-description">${item.description}</p>
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// Generate Projects Timeline
function generateProjectsTimeline() {
    const projectsContainer = document.getElementById('projects-timeline');
    const projectsPlaceholder = document.getElementById('projects-placeholder');
    
    if (projectsData.length === 0) {
        projectsPlaceholder.style.display = 'block';
        projectsContainer.style.display = 'none';
        return;
    }
    
    projectsPlaceholder.style.display = 'none';
    projectsContainer.style.display = 'block';
    
    projectsData.forEach((project) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        const tagsHTML = project.tags
            .map(tag => `<span class="tag">${tag}</span>`)
            .join('');
        
        projectItem.innerHTML = `
            <div class="project-item-content">
                <div class="project-item-date">${project.dateDisplay}</div>
                <h3>${project.title}</h3>
                <p class="project-item-description">${project.description}</p>
                <div class="project-item-tags">
                    ${tagsHTML}
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectItem);
    });
}

// Generate Certifications
function generateCertifications() {
    const certsContainer = document.getElementById('certifications');
    const certsPlaceholder = document.getElementById('certs-placeholder');
    
    if (certificationsData.length === 0) {
        certsPlaceholder.style.display = 'block';
        certsContainer.style.display = 'none';
        return;
    }
    
    certsPlaceholder.style.display = 'none';
    certsContainer.style.display = 'block';
    
    certificationsData.forEach((cert) => {
        const certItem = document.createElement('div');
        certItem.className = 'cert-item';
        
        certItem.innerHTML = `
            <h4>${cert.title}</h4>
            <p>${cert.issuer} - ${cert.date}</p>
        `;
        
        certsContainer.appendChild(certItem);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    generateEducationTimeline();
    generateProjectsTimeline();
    generateCertifications();
});
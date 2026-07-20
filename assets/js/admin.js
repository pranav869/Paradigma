// admin.js

document.addEventListener('AdminAuthenticated', () => {
    // Only run this when authenticated
    initProjectsManager();
});

function initProjectsManager() {
    const supabase = window.supabaseClient;
    const projectsTbody = document.getElementById('projects-tbody');
    const modal = document.getElementById('project-modal');
    const projectForm = document.getElementById('project-form');
    const btnAddProject = document.getElementById('btn-add-project');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const modalTitle = document.getElementById('modal-title');
    const imagePreviewContainer = document.getElementById('image-preview-container');

    let currentProjects = [];

    // Fetch and display projects
    async function loadProjects() {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('order', { ascending: true });

        projectsTbody.innerHTML = '';
        currentProjects = [];
        
        if (error || !data || data.length === 0) {
            projectsTbody.innerHTML = '<tr><td colspan="5">No projects found.</td></tr>';
            if (error) console.error("Error fetching projects: ", error);
            return;
        }

        data.forEach((project) => {
            currentProjects.push(project);
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${project.imageUrl || ''}" class="project-img-preview" alt="Thumbnail"></td>
                <td>${project.order || 0}</td>
                <td><strong>${project.title}</strong></td>
                <td>${project.category}</td>
                <td>
                    <button class="btn-small secondary btn-edit" data-id="${project.id}">Edit</button>
                    <button class="btn-small danger btn-delete" data-id="${project.id}">Delete</button>
                </td>
            `;
            projectsTbody.appendChild(tr);
        });

        // Attach event listeners for edit and delete buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => editProject(e.target.getAttribute('data-id')));
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => deleteProject(e.target.getAttribute('data-id')));
        });
    }

    // Initialize list
    loadProjects();

    // Show modal for adding
    btnAddProject.addEventListener('click', () => {
        modalTitle.textContent = 'Add Project';
        projectForm.reset();
        document.getElementById('proj-id').value = '';
        document.getElementById('proj-image-path').value = '';
        document.getElementById('proj-image-url').value = '';
        imagePreviewContainer.innerHTML = '';
        modal.style.display = 'flex';
    });

    // Close modal
    btnCancelModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Edit project
    function editProject(id) {
        const project = currentProjects.find(p => p.id === id);
        if (!project) return;

        modalTitle.textContent = 'Edit Project';
        document.getElementById('proj-id').value = project.id;
        document.getElementById('proj-title').value = project.title || '';
        document.getElementById('proj-category').value = project.category || '';
        document.getElementById('proj-location').value = project.location || '';
        document.getElementById('proj-year').value = project.completionYear || '';
        document.getElementById('proj-desc').value = project.description || '';
        document.getElementById('proj-order').value = project.order || 0;
        document.getElementById('proj-image-url').value = project.imageUrl || '';
        document.getElementById('proj-image-path').value = project.imagePath || '';
        
        if (project.imageUrl) {
            imagePreviewContainer.innerHTML = `<img src="${project.imageUrl}" style="max-width: 150px; border-radius: 4px; display: block; margin-top: 10px;">`;
        } else {
            imagePreviewContainer.innerHTML = '';
        }

        modal.style.display = 'flex';
    }

    // Delete project
    async function deleteProject(id) {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
        
        const project = currentProjects.find(p => p.id === id);
        if (!project) return;

        try {
            // Delete image from storage if it exists
            if (project.imagePath) {
                const { error: storageError } = await supabase.storage.from('images').remove([project.imagePath]);
                if (storageError) console.warn('Image not found or error deleting from storage.', storageError);
            }

            // Delete document from Supabase
            const { error: dbError } = await supabase.from('projects').delete().eq('id', id);
            if (dbError) throw dbError;

            // Refresh UI
            loadProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Failed to delete project. Please try again.");
        }
    }

    // Save project (Add/Edit)
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btnSave = document.getElementById('btn-save-project');
        btnSave.textContent = 'Saving...';
        btnSave.disabled = true;

        const id = document.getElementById('proj-id').value;
        const fileInput = document.getElementById('proj-image');
        
        let imageUrl = document.getElementById('proj-image-url').value;
        let imagePath = document.getElementById('proj-image-path').value;

        try {
            // Handle image upload if a new file is selected
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const newImagePath = `projects/${Date.now()}_${file.name}`;
                
                // Upload new image to Supabase Storage (bucket named 'images')
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(newImagePath, file);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(newImagePath);
                const newImageUrl = publicUrlData.publicUrl;

                // If editing and there's an old image, delete it
                if (id && imagePath) {
                    await supabase.storage.from('images').remove([imagePath]);
                }

                imageUrl = newImageUrl;
                imagePath = newImagePath;
            }

            const projectData = {
                title: document.getElementById('proj-title').value,
                category: document.getElementById('proj-category').value,
                location: document.getElementById('proj-location').value,
                completionYear: document.getElementById('proj-year').value,
                description: document.getElementById('proj-desc').value,
                order: parseInt(document.getElementById('proj-order').value) || 0,
                imageUrl: imageUrl,
                imagePath: imagePath
            };

            if (id) {
                // Update
                const { error } = await supabase.from('projects').update(projectData).eq('id', id);
                if (error) throw error;
            } else {
                // Add
                const { error } = await supabase.from('projects').insert([projectData]);
                if (error) throw error;
            }

            modal.style.display = 'none';
            // Refresh UI
            loadProjects();
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Failed to save project. Check console for details.");
        } finally {
            btnSave.textContent = 'Save Project';
            btnSave.disabled = false;
        }
    });
}

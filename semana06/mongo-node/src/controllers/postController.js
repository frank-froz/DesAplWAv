import postService from "../services/postService.js";
import userService from "../services/userService.js";

class PostController {
    // Renderizar vista con todos los posts
    async index(req, res) {
        try {
            const posts = await postService.getPosts();
            const users = await userService.getUsers(); // Para el formulario de creación
            res.render("posts", { posts, users });
        } catch (error) {
            res.status(500).render("error", { error: error.message });
        }
    }

    // Mostrar formulario de creación
    async showCreateForm(req, res) {
        try {
            const users = await userService.getUsers();
            res.render("create-post", { users });
        } catch (error) {
            res.status(500).render("error", { error: error.message });
        }
    }

    // Crear nuevo post
    async create(req, res) {
        try {
            const { userId, title, content, imageUrl, hashtag } = req.body;
            
            // Procesar hashtags (convertir string separado por comas a array)
            const hashtagArray = hashtag ? hashtag.split(',').map(tag => tag.trim()) : [];
            
            const postData = { title, content };
            const post = await postService.createPost(userId, postData, imageUrl, hashtagArray);
            
            res.redirect("/posts");
        } catch (error) {
            const users = await userService.getUsers();
            res.render("create-post", { 
                users, 
                error: error.message,
                formData: req.body 
            });
        }
    }

    // Mostrar formulario de edición
    async showEditForm(req, res) {
        try {
            const { id } = req.params;
            const post = await postService.getPostById(id);
            const users = await userService.getUsers();
            
            if (!post) {
                return res.status(404).render("error", { error: "Post no encontrado" });
            }
            
            res.render("edit-post", { post, users });
        } catch (error) {
            res.status(500).render("error", { error: error.message });
        }
    }

    // API - Obtener todos los posts (JSON)
    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // API - Obtener post por ID (JSON)
    async getById(req, res) {
        try {
            const { id } = req.params;
            const post = await postService.getPostById(id);
            if (!post) return res.status(404).json({ error: "Post no encontrado" });
            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Actualizar post
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, content, imageUrl, hashtag } = req.body;
            
            // Procesar hashtags
            const hashtagArray = hashtag ? hashtag.split(',').map(tag => tag.trim()) : [];
            
            const updateData = { title, content, imageUrl, hashtag: hashtagArray };
            const updatedPost = await postService.updatePost(id, updateData);
            
            if (!updatedPost) {
                return res.status(404).render("error", { error: "Post no encontrado" });
            }
            
            res.redirect("/posts");
        } catch (error) {
            const post = await postService.getPostById(req.params.id);
            const users = await userService.getUsers();
            res.render("edit-post", { 
                post, 
                users, 
                error: error.message,
                formData: req.body 
            });
        }
    }

    // Eliminar post
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedPost = await postService.deletePost(id);
            
            if (!deletedPost) {
                return res.status(404).render("error", { error: "Post no encontrado" });
            }
            
            res.redirect("/posts");
        } catch (error) {
            res.status(500).render("error", { error: error.message });
        }
    }

    // API - Eliminar post (JSON)
    async deleteAPI(req, res) {
        try {
            const { id } = req.params;
            const deletedPost = await postService.deletePost(id);
            if (!deletedPost) return res.status(404).json({ error: "Post no encontrado" });
            res.status(200).json({ message: "Post eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new PostController();

/*const API_BASE_URL = "http://127.0.0.1:8000";  // Ensure this is correct

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload/`, {
        method: "POST",
        body: formData,
    });

    return response.json();
};

export const summarizeReport = async () => {
    const response = await fetch(`${API_BASE_URL}/summarize/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    return response.json();
};*/
/*const API_BASE_URL = "http://127.0.0.1:8000";  // Change to deployed backend URL after deployment

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_BASE_URL}/upload/`, {
            method: "POST",
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error("Upload Error:", error);
        return { error: "Failed to upload file" };
    }
};

export const summarizeReport = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/summarize/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        return await response.json();
    } catch (error) {
        console.error("Summarization Error:", error);
        return { error: "Failed to summarize" };
    }
};*/
const API_BASE_URL = "http://127.0.0.1:8000";  // Change to deployed backend URL after deployment

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_BASE_URL}/upload/`, {
            method: "POST",
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error("Upload Error:", error);
        return { error: "Failed to upload file" };
    }
};

export const summarizeReport = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/summarize/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        return await response.json();
    } catch (error) {
        console.error("Summarization Error:", error);
        return { error: "Failed to summarize" };
    }
};

// ✅ New API function to fetch visualization data
export const fetchVisualization = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/visualize/", {
            method: "POST",  // ✅ Ensure it's a POST request
            headers: { "Content-Type": "application/json" },
        });
        return await response.json();
    } catch (error) {
        console.error("Visualization Error:", error);
        return { error: "Failed to generate visualization" };
    }
};


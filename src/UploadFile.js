/*import { useState } from "react";
import { uploadFile, summarizeReport } from "./api";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const uploadResponse = await uploadFile(file);
        console.log("Upload response:", uploadResponse);

        const summarizeResponse = await summarizeReport();
        console.log("Summary response:", summarizeResponse);

        setSummary(summarizeResponse.summary);
    };

    return (
        <div>
            <h2>Upload a Financial File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload & Get Summary</button>
            <h3>AI Summary:</h3>
            <p>{summary}</p>
        </div>
    );
};

export default UploadFile;*/
/*import { useState } from "react";
import { uploadFile, summarizeReport } from "./api";
import ChartComponent from "./ChartComponent";
import { Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [chartData, setChartData] = useState(null); // ✅ Default is null, not undefined
    const [showCharts, setShowCharts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setErrorMessage("Please select a file first!");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            await uploadFile(file);
            alert("File uploaded successfully! Now click Summarize or Visualize.");
        } catch (error) {
            setErrorMessage("Failed to upload file.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSummarize = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const response = await summarizeReport();
            
            if (response.error) {
                setErrorMessage(response.error);
                return;
            }

            setSummary(response.summary);
        } catch (error) {
            setErrorMessage("Failed to summarize.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVisualize = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const response = await summarizeReport();
            
            if (response.error || !response.data) { // ✅ Handle missing data
                setErrorMessage(response.error || "No visualization data available.");
                return;
            }

            setChartData(response.data);
            setShowCharts(true);
        } catch (error) {
            setErrorMessage("Failed to generate visualization.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <Card style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
                <CardContent>
                    <Typography variant="h5">Upload a Financial File</Typography>
                    <input type="file" onChange={handleFileChange} style={{ marginTop: 10 }} />
                    <Button variant="contained" color="primary" onClick={handleUpload} style={{ margin: 10 }}>
                        Upload
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleSummarize} style={{ margin: 10 }}>
                        Summarize
                    </Button>
                    <Button variant="contained" color="success" onClick={handleVisualize} style={{ margin: 10 }}>
                        Visualize
                    </Button>

                    {loading && <CircularProgress style={{ marginTop: 20 }} />}
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}

                    {summary && (
                        <Card variant="outlined" style={{ marginTop: 20, padding: 10 }}>
                            <Typography variant="h6">AI Summary:</Typography>
                            <Typography>{summary}</Typography>
                        </Card>
                    )}

                    {showCharts && chartData && chartData.length > 0 && ( // ✅ Ensure chartData exists
                        <div style={{ marginTop: 20 }}>
                            <ChartComponent data={chartData} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UploadFile;*/
/*import { useState } from "react";
import { uploadFile, summarizeReport, fetchVisualization } from "./api";
import ChartComponent from "./ChartComponent";
import { Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [chartHTML, setChartHTML] = useState(null); // ✅ Stores Plotly-generated HTML
    const [showCharts, setShowCharts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // ✅ Handle File Selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // ✅ Handle File Upload
    const handleUpload = async () => {
        if (!file) {
            setErrorMessage("Please select a file first!");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            const response = await uploadFile(file);

            if (response.error) {
                setErrorMessage(response.error);
                return;
            }

            alert("File uploaded successfully! Now click Summarize or Visualize.");
        } catch (error) {
            setErrorMessage("Failed to upload file.");
            console.error("Upload Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle AI Summarization
    const handleSummarize = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const response = await summarizeReport();
            
            if (response.error) {
                setErrorMessage(response.error);
                return;
            }

            setSummary(response.summary);
        } catch (error) {
            setErrorMessage("Failed to summarize.");
            console.error("Summarization Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVisualize = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
    
            const response = await fetchVisualization();
    
            console.log("Full Visualization API Response:", response); // ✅ Debugging log
    
            if (!response || typeof response !== "object" || !response.graph) {
                setErrorMessage("No valid visualization data received.");
                return;
            }
    
            console.log("Extracted Graph JSON:", response.graph); // ✅ Debugging log
    
            setChartHTML(response.graph); // ✅ Store JSON instead of HTML
            setShowCharts(true);
    
        } catch (error) {
            setErrorMessage("Failed to generate visualization.");
            console.error("Visualization Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <Card style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
                <CardContent>
                    <Typography variant="h5">Upload a Financial File</Typography>
                    <input type="file" onChange={handleFileChange} style={{ marginTop: 10 }} />
                    <Button variant="contained" color="primary" onClick={handleUpload} style={{ margin: 10 }}>
                        Upload
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleSummarize} style={{ margin: 10 }}>
                        Summarize
                    </Button>
                    <Button variant="contained" color="success" onClick={handleVisualize} style={{ margin: 10 }}>
                        Visualize
                    </Button>

                    {loading && <CircularProgress style={{ marginTop: 20 }} />}
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}

                    {summary && (
                        <Card variant="outlined" style={{ marginTop: 20, padding: 10 }}>
                            <Typography variant="h6">AI Summary:</Typography>
                            <Typography>{summary}</Typography>
                        </Card>
                    )}

                    {showCharts && chartHTML && ( 
                        <div style={{ marginTop: 20 }}>
                            <ChartComponent chartHTML={chartHTML} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UploadFile;*/
import { useState } from "react";
import { uploadFile, summarizeReport, fetchVisualization } from "./api";
import ChartComponent from "./ChartComponent";
import { Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [chartHTML, setChartHTML] = useState(null);
    const [showCharts, setShowCharts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // ✅ Reset visualization and summary when selecting a new file
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setSummary("");  // ✅ Clear summary
        setChartHTML(null);  // ✅ Clear old visualization
        setShowCharts(false);
    };

    const handleUpload = async () => {
        if (!file) {
            setErrorMessage("Please select a file first!");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            await uploadFile(file);
            alert("✅ File uploaded successfully! Now click Summarize or Visualize.");
        } catch (error) {
            setErrorMessage("❌ Failed to upload file.");
            console.error("Upload Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSummarize = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            setChartHTML(null);  // ✅ Clear previous visualization when summarizing
            const response = await summarizeReport();
            
            if (response.error) {
                setErrorMessage(response.error);
                return;
            }

            setSummary(response.summary);
        } catch (error) {
            setErrorMessage("❌ Failed to summarize.");
            console.error("Summarization Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVisualize = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
    
            const response = await fetchVisualization();
    
            if (!response.graph) {
                setErrorMessage("⚠️ No valid visualization data received.");
                return;
            }

            setChartHTML(response.graph);
            setShowCharts(true);
    
        } catch (error) {
            setErrorMessage("❌ Failed to generate visualization.");
            console.error("Visualization Error:", error);
        } finally {
            setLoading(false);
        }
    };
    // const handleVisualize = async () => {
    //     try {
    //         setLoading(true);
    //         setErrorMessage("");
    
    //         const response = await fetchVisualization();
    //         console.log("Full Visualization API Response:", response);
    
    //         // Check if the response contains an error property
    //         if (response.error) {
    //             setErrorMessage(response.error);
    //             return;
    //         }
    
    //         if (!response.graph || typeof response.graph !== "string") {
    //             setErrorMessage("No valid visualization data received.");
    //             return;
    //         }
    
    //         // If we reach here, we assume response.graph is valid JSON string
    //         setChartHTML(response.graph);
    //         setShowCharts(true);
    //     } catch (error) {
    //         setErrorMessage("Failed to generate visualization.");
    //         console.error("Visualization Error:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f4f4f4", padding: "20px" }}>
            <Card style={{ maxWidth: 600, padding: 20, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px", width: "100%" }}>
                <CardContent>
                    <Typography variant="h5" style={{ fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
                        📂 Upload a Financial File
                    </Typography>

                    <input type="file" onChange={handleFileChange} style={{ display: "block", margin: "10px auto", padding: "10px" }} />

                    {file && (
                        <Typography variant="body1" style={{ textAlign: "center", color: "#555" }}>
                            Selected File: {file.name}
                        </Typography>
                    )}

                    <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: 20 }}>
                        <Button variant="contained" color="primary" onClick={handleUpload} style={{ padding: "10px 15px", fontWeight: "bold" }}>
                            Upload
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleSummarize} style={{ padding: "10px 15px", fontWeight: "bold" }}>
                            Summarize
                        </Button>
                        <Button variant="contained" color="success" onClick={handleVisualize} style={{ padding: "10px 15px", fontWeight: "bold" }}>
                            Visualize
                        </Button>
                    </div>

                    {loading && <CircularProgress style={{ marginTop: 20, display: "block", margin: "auto" }} />}
                    {errorMessage && <Typography color="error" style={{ textAlign: "center", marginTop: 10 }}>{errorMessage}</Typography>}

                    {summary && (
                        <Card variant="outlined" style={{ 
                            marginTop: 20, 
                            padding: 10, 
                            background: "#f9f9f9", 
                            maxHeight: "200px", 
                            overflowY: "auto" // ✅ Prevents overflow
                        }}>
                            <Typography variant="h6" style={{ fontWeight: "bold" }}>📋 AI Summary:</Typography>
                            <Typography style={{ color: "#333", wordWrap: "break-word" }}>{summary}</Typography>
                        </Card>
                    )}

                    {showCharts && chartHTML && ( 
                        <div style={{ marginTop: 20 }}>
                            <ChartComponent chartHTML={chartHTML} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UploadFile;





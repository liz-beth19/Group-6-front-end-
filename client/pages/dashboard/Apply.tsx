import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { companies } from "@/data/companies";
import { addApplication } from "@/store/app";
import { JobPost } from "@/store/jobs";
import { useAuth } from "@/context/AuthContext";

// Helper function for file conversion
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export default function Apply() {
  const { slug, jobId } = useParams<{ slug: string; jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPost = slug === "post";
  const [post, setPost] = useState<JobPost | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const company = !isPost ? companies.find((c) => c.slug === slug) : undefined;
  const job = !isPost ? company?.jobs.find((j) => j.id === jobId) : undefined;

  // Fetch job post from Spring Boot API if it's a post
  useEffect(() => {
    if (isPost && jobId) {
      const fetchJob = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Try different possible Spring Boot endpoints
          const possibleEndpoints = [
            `http://localhost:8080/api/jobs/${jobId}`,
            `http://localhost:8080/api/admin/public/${jobId}`,
            `http://localhost:8080/jobs/${jobId}`,
            `http://localhost:8080/api/v1/jobs/${jobId}`,
            `http://localhost:8081/api/jobs/${jobId}`,
            `http://localhost:8081/jobs/${jobId}`
          ];
          
          let response = null;
          let lastError = null;
          
          for (const endpoint of possibleEndpoints) {
            try {
              console.log(`Trying job endpoint: ${endpoint}`);
              response = await fetch(endpoint, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                }
              });
              
              if (response.ok) {
                console.log(`Success with job endpoint: ${endpoint}`);
                break;
              } else {
                console.log(`Failed with ${endpoint}: ${response.status} ${response.statusText}`);
              }
            } catch (err) {
              console.log(`Error with ${endpoint}:`, err);
              lastError = err;
            }
          }
          
          if (!response || !response.ok) {
            throw new Error(`Job not found. Last error: ${lastError?.message || 'All endpoints failed'}`);
          }
          
          const jobData = await response.json();
          console.log("Job data received:", jobData);
          setPost(jobData);
        } catch (err) {
          console.error("Error fetching job:", err);
          setError(`Failed to load job details: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchJob();
    }
  }, [isPost, jobId]);

  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-sm text-muted-foreground">Loading job details...</div>
        </div>
      </section>
    );
  }

  if (error || ((!isPost && (!company || !job)) || (isPost && !post))) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <p className="text-sm text-destructive">{error || "Job not found."}</p>
          <Link to="/dashboard/opportunities" className="text-primary underline">Back to opportunities</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold">Apply — {isPost ? `${post!.company} • ${post!.title}` : `${company!.name} • ${job!.title}`}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please fill out all required fields (*) to submit your application.</p>
        <form
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError(null);
            const form = e.target as HTMLFormElement;
            const fd = new FormData(form);
            
            // Handle file uploads
            const resumeFile = fd.get("resumeFile") as File | null;
            const idDocumentFile = fd.get("idDocumentFile") as File | null;
            const coverLetterFile = fd.get("coverLetterFile") as File | null;
            
            let resumeName: string | undefined;
            let resumeDataUrl: string | undefined;
            let idDocumentName: string | undefined;
            let idDocumentDataUrl: string | undefined;
            let coverLetterFileName: string | undefined;
            let coverLetterDataUrl: string | undefined;
            
            // Process resume file
            if (resumeFile && resumeFile.size > 0) {
              if (resumeFile.size > 5 * 1024 * 1024) {
                setError("Resume PDF is too large (max 5MB).");
                setSubmitting(false);
                return;
              }
              if (!resumeFile.type.includes("pdf")) {
                setError("Please upload a PDF file for resume.");
                setSubmitting(false);
                return;
              }
              resumeName = resumeFile.name;
              resumeDataUrl = await convertFileToBase64(resumeFile);
            }
            
            // Process ID document file
            if (idDocumentFile && idDocumentFile.size > 0) {
              if (idDocumentFile.size > 5 * 1024 * 1024) {
                setError("ID Document PDF is too large (max 5MB).");
                setSubmitting(false);
                return;
              }
              if (!idDocumentFile.type.includes("pdf")) {
                setError("Please upload a PDF file for ID document.");
                setSubmitting(false);
                return;
              }
              idDocumentName = idDocumentFile.name;
              idDocumentDataUrl = await convertFileToBase64(idDocumentFile);
            }
            
            // Process cover letter file
            if (coverLetterFile && coverLetterFile.size > 0) {
              if (coverLetterFile.size > 5 * 1024 * 1024) {
                setError("Cover Letter PDF is too large (max 5MB).");
                setSubmitting(false);
                return;
              }
              if (!coverLetterFile.type.includes("pdf")) {
                setError("Please upload a PDF file for cover letter.");
                setSubmitting(false);
                return;
              }
              coverLetterFileName = coverLetterFile.name;
              coverLetterDataUrl = await convertFileToBase64(coverLetterFile);
            }
            
            try {
              // Check if user is authenticated
              if (!user) {
                setError("Please log in to submit an application.");
                setSubmitting(false);
                return;
              }

              console.log("User authenticated:", user);

              // Get the job ID
              const targetJobId = isPost ? post!.id : job!.id;
              
              // Prepare form data for backend
              const apiFormData = new FormData();
              
              // Only append files if they exist and have content
              if (resumeFile && resumeFile.size > 0) {
                apiFormData.append("cv", resumeFile);
              } else {
                // Create a minimal empty PDF file
                const emptyPdf = new File([], "empty.pdf", { type: "application/pdf" });
                apiFormData.append("cv", emptyPdf);
              }
              
              if (idDocumentFile && idDocumentFile.size > 0) {
                apiFormData.append("id", idDocumentFile);
              } else {
                const emptyPdf = new File([], "empty.pdf", { type: "application/pdf" });
                apiFormData.append("id", emptyPdf);
              }
              
              if (coverLetterFile && coverLetterFile.size > 0) {
                apiFormData.append("coverLetter", coverLetterFile);
              } else {
                const emptyPdf = new File([], "empty.pdf", { type: "application/pdf" });
                apiFormData.append("coverLetter", emptyPdf);
              }
              
              apiFormData.append("coverLetterText", fd.get("coverLetter") as string || "");
              apiFormData.append("applicationName", fd.get("name") as string || "");
              
              // Convert province string to enum value
              const provinceValue = fd.get("province") as string;
              if (provinceValue) {
                apiFormData.append("province", provinceValue);
              }

              // Get authentication token from localStorage
              const token = localStorage.getItem("gg_auth_token");
              console.log("Token found:", token ? "Yes" : "No");
              console.log("Token preview:", token ? token.substring(0, 20) + "..." : "None");
              
              if (!token) {
                setError("Authentication token not found. Please log in again.");
                setSubmitting(false);
                return;
              }

              console.log("Submitting application to:", `http://localhost:8080/api/auth/apply/${targetJobId}`);
              console.log("User context:", user);

              // Test authentication first
              try {
                const testResponse = await fetch("http://localhost:8080/api/auth/health", {
                  method: "GET",
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                  }
                });
                console.log("Health check response:", testResponse.status);
                if (!testResponse.ok) {
                  console.log("Health check failed, token might be invalid");
                }
              } catch (e) {
                console.log("Health check error:", e);
              }

              // Submit to backend API
              const response = await fetch(`http://localhost:8080/api/auth/apply/${targetJobId}`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Accept": "application/json"
                },
                body: apiFormData
              });

              if (!response.ok) {
                console.log("Response status:", response.status);
                console.log("Response headers:", Object.fromEntries(response.headers.entries()));
                
                let errorMessage = `Application failed (${response.status})`;
                let errorDetails = "";
                
                try {
                  const errorData = await response.json();
                  console.log("Error response data:", errorData);
                  if (errorData?.message) errorMessage = errorData.message;
                  if (errorData?.error) errorMessage = errorData.error;
                  if (errorData?.details) errorDetails = errorData.details;
                } catch (e) {
                  console.log("Could not parse error response as JSON");
                  const textResponse = await response.text();
                  console.log("Error response text:", textResponse);
                  errorDetails = textResponse;
                }
                
                if (response.status === 403) {
                  errorMessage = "Access denied. Please make sure you are logged in and have the correct permissions.";
                } else if (response.status === 401) {
                  errorMessage = "Authentication failed. Please log in again.";
                }
                
                throw new Error(`${errorMessage}${errorDetails ? ` - ${errorDetails}` : ""}`);
              }

              const savedApplication = await response.json();
              console.log("Application saved to database:", savedApplication);

              // Also add to local storage for immediate UI update
              addApplication({
                id: savedApplication.id.toString(),
                province: savedApplication.province,
                applicationName: savedApplication.applicationName,
                coverLetter: savedApplication.coverLetter,
                status: savedApplication.status,
                appliedDate: savedApplication.appliedDate,
                cvPath: savedApplication.cvPath,
                idDocumentPath: savedApplication.idDocumentPath,
                coverLetterPath: savedApplication.coverLetterPath,
                jobOpening: {
                  id: savedApplication.jobOpening?.id?.toString() || targetJobId,
                  title: savedApplication.jobOpening?.title || (isPost ? post!.title : job!.title),
                  company: savedApplication.jobOpening?.company || (isPost ? post!.company : company!.slug),
                  location: savedApplication.jobOpening?.location || (isPost ? post!.location : job!.location),
                  type: savedApplication.jobOpening?.type || (isPost ? post!.type : job!.type),
                },
                // Legacy fields for backward compatibility
                company: isPost ? post!.company : company!.slug,
                jobId: targetJobId,
                position: isPost ? post!.title : job!.title,
                dateApplied: savedApplication.appliedDate,
                resumeName,
                resumeDataUrl,
              });

              navigate("/dashboard/applications", { replace: true, state: { applied: true } });
            } catch (err: any) {
              setError(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {/* Personal Information Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-primary">Personal Information</h3>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Full name *</label>
            <input name="name" className="h-10 w-full rounded-md border border-input px-3" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email *</label>
            <input type="email" name="email" className="h-10 w-full rounded-md border border-input px-3" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input name="phone" className="h-10 w-full rounded-md border border-input px-3" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Province *</label>
            <select name="province" className="h-10 w-full rounded-md border border-input px-3" required>
              <option value="">Select Province</option>
              <option value="MPUMALANGA">Mpumalanga</option>
              <option value="EASTERN_CAPE">Eastern Cape</option>
              <option value="FREE_STATE">Free State</option>
              <option value="GAUTENG">Gauteng</option>
              <option value="NORTH_WEST">North West</option>
              <option value="LIMPOPO">Limpopo</option>
              <option value="NORHTERN_CAPE">Northern Cape</option>
              <option value="WESTERN_CAPE">Western Cape</option>
            </select>
          </div>

          {/* Resume Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-primary mt-6">Resume & Documents</h3>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Resume URL</label>
            <input name="resumeUrl" className="h-10 w-full rounded-md border border-input px-3" placeholder="Link to your CV" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Upload PDF Resume *</label>
            <input name="resumeFile" type="file" accept="application/pdf" className="block w-full text-sm" required />
            <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB</p>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Upload ID Document (PDF)</label>
            <input name="idDocumentFile" type="file" accept="application/pdf" className="block w-full text-sm" />
            <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB</p>
          </div>

          {/* Cover Letter Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-primary mt-6">Cover Letter</h3>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Cover letter (Text)</label>
            <textarea name="coverLetter" className="min-h-[120px] w-full rounded-md border border-input px-3 py-2" placeholder="Write your cover letter here..." />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Upload Cover Letter (PDF)</label>
            <input name="coverLetterFile" type="file" accept="application/pdf" className="block w-full text-sm" />
            <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB (optional)</p>
          </div>
          {error ? <div className="md:col-span-2 text-sm text-destructive">{error}</div> : null}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit application"}
            </button>
            <Link to={isPost ? "/dashboard/opportunities" : `/dashboard/company/${company!.slug}`} className="ml-3 text-sm text-muted-foreground underline">Cancel</Link>
          </div>
        </form>
      </div>
    </section>
  );
}

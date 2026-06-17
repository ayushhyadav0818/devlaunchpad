import React, { useState, useEffect } from "react";
import { getProjects, addProject, upvoteProject, addComment } from "./db";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [activeProject, setActiveProject] = useState(null);
  
  // Modals state
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Auth Form State
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [user, setUser] = useState(null); // Active user session

  // Launch Form State
  const [newName, setNewName] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTagsString, setNewTagsString] = useState("");
  const [newGithub, setNewGithub] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  // Comment State
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    setProjects(getProjects());
    const savedUser = localStorage.getItem("dev_launchpad_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleVote = (id, e) => {
    e.stopPropagation();
    const updated = upvoteProject(id);
    setProjects(updated);
    if (activeProject && activeProject.id === id) {
      setActiveProject(updated.find(p => p.id === id));
    }
  };

  const handleLaunch = (e) => {
    e.preventDefault();
    if (!newName || !newTagline || !newDesc) return;

    const parsedTags = newTagsString
      ? newTagsString.split(",").map(t => t.trim()).filter(t => t.length > 0)
      : ["SaaS"];

    const updated = addProject({
      name: newName,
      tagline: newTagline,
      description: newDesc,
      tags: parsedTags,
      github: newGithub,
      website: newWebsite,
      creator: user ? user.name : "Ayush Yadav",
      creatorGithub: user ? user.github : "ayushhyadav0818"
    });

    setProjects(updated);
    
    // Reset inputs
    setNewName("");
    setNewTagline("");
    setNewDesc("");
    setNewTagsString("");
    setNewGithub("");
    setNewWebsite("");
    setShowLaunchModal(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !activeProject) return;
    const authorName = user ? user.name : "Innovator Guest";
    const updated = addComment(activeProject.id, commentText, authorName);
    setProjects(updated);
    setActiveProject(updated.find(p => p.id === activeProject.id));
    setCommentText("");
  };

  // Auth Handling
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !passInput) return;
    const loggedUser = {
      name: nameInput || emailInput.split("@")[0],
      email: emailInput,
      github: emailInput.split("@")[0] + "-dev",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    };
    localStorage.setItem("dev_launchpad_user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    setShowAuthModal(false);
    resetAuthFields();
  };

  const handleProviderLogin = (provider) => {
    let mockUser = {
      name: `Ayush (${provider})`,
      email: `ayush-${provider.toLowerCase()}@gmail.com`,
      github: "ayushhyadav0818",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150"
    };
    if (provider === "GitHub") {
      mockUser.avatar = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150";
    } else if (provider === "Apple") {
      mockUser.avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150";
    }
    localStorage.setItem("dev_launchpad_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("dev_launchpad_user");
    setUser(null);
  };

  const resetAuthFields = () => {
    setEmailInput("");
    setPassInput("");
    setNameInput("");
  };

  // Get counts for sidebar tags
  const getCategoryCount = (tag) => {
    if (tag === "All") return projects.length;
    return projects.filter(p => p.tags.includes(tag)).length;
  };

  const availableTags = ["All", "AI", "SaaS", "Developer Tools", "Productivity", "Database"];

  // Filtering projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#060609", color: "#e5e2e3" }}>
      {/* Top Navbar */}
      <nav style={{
        position: "sticky", top: 0, width: "100%", zIndex: 50,
        background: "rgba(6, 6, 9, 0.8)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          height: "68px", padding: "0 24px", maxWidth: "1280px", margin: "0 auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <a href="#" style={{ fontSize: "24px", fontWeight: "800", textDecoration: "none", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #06B6D4)" }}></span>
              DevLaunch
            </a>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src={user.avatar} alt={user.name} style={{ width: "34px", height: "34px", borderRadius: "50%", border: "2px solid #6366f1", objectFit: "cover" }} />
                <span style={{ fontSize: "14px", color: "#c0c1ff", fontWeight: "600" }}>{user.name}</span>
                <button 
                  onClick={handleSignOut}
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "6px 12px", color: "#c7c4d7", cursor: "pointer", fontSize: "12px" }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                className="btn-primary" 
                onClick={() => setShowAuthModal(true)}
                style={{ padding: "10px 22px", fontSize: "13px" }}
              >
                Sign In / Join
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Conditional Rendering: Landing vs Workspace */}
      {!user ? (
        /* Dynamic Landing Page */
        <div style={{ display: "flex", flexDirection: "column" }} className="animate-fade">
          {/* Hero Header */}
          <header style={{ position: "relative", paddingTop: "100px", paddingBottom: "100px", textAlign: "center", overflow: "hidden" }}>
            <div className="grid-bg" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}></div>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "500px", height: "500px", background: "rgba(99, 102, 241, 0.08)",
              borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none"
            }}></div>
            
            <div style={{ relative: "z-10", maxWidth: "900px", margin: "0 auto", padding: "0 24px" }} className="animate-slide">
              <span style={{
                display: "inline-flex", padding: "6px 14px", borderRadius: "999px",
                background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)",
                color: "#c0c1ff", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "24px"
              }}>
                The Future of Micro-SaaS
              </span>
              <h1 className="glow-text" style={{ fontSize: "56px", fontWeight: "800", color: "#fff", marginBottom: "24px", lineHeight: "1.1", letterSpacing: "-0.04em" }}>
                Validate & Launch Your <br />
                <span style={{ background: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Side-Projects Instantly</span>
              </h1>
              <p style={{ color: "#c7c4d7", fontSize: "19px", lineHeight: "1.6", maxWidth: "680px", margin: "0 auto 40px auto" }}>
                DevLaunch provides a dedicated sandbox to showcase developer-first micro-SaaS startups. Connect, collect upvotes, and gather actionable feedback.
              </p>
              
              <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                <button className="btn-primary" onClick={() => setShowAuthModal(true)} style={{ padding: "16px 36px", fontSize: "16px" }}>
                  Access Workspace Now 🚀
                </button>
              </div>
            </div>
          </header>

          {/* Core Features / Why DevLaunch */}
          <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px", width: "100%" }}>
            <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "800", color: "#fff", marginBottom: "48px" }}>Why DevLaunch?</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
              <div className="glass-panel" style={{ padding: "32px", borderRadius: "12px" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>🔥</div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>Instant Validation</h3>
                <p style={{ color: "#c7c4d7", fontSize: "15px", lineHeight: "1.6" }}>
                  Skip complex marketing setup. Pitch directly to a tech-savvy community of developers, builders, and early adopters.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "32px", borderRadius: "12px" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>📈</div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>Luminescent Insights</h3>
                <p style={{ color: "#c7c4d7", fontSize: "15px", lineHeight: "1.6" }}>
                  Every project dashboard comes with built-in visitor traffic tracking and upvote-to-view conversion analytics.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "32px", borderRadius: "12px" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>💬</div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>Interactive Discussions</h3>
                <p style={{ color: "#c7c4d7", fontSize: "15px", lineHeight: "1.6" }}>
                  Gather technical advice, feature requests, or collaboration proposals directly from peers through sandbox discussion board.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section style={{ background: "rgba(255, 255, 255, 0.01)", borderTop: "1px solid rgba(255, 255, 255, 0.05)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", padding: "80px 24px" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "800", color: "#fff", marginBottom: "56px" }}>Three Simple Steps</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: "0 0 8px 0" }}>Sign In or Join</h4>
                    <p style={{ color: "#c7c4d7", fontSize: "15px", margin: 0 }}>Authenticate with Google, GitHub, Apple or your email to open the workspace environment.</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#06B6D4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: "0 0 8px 0" }}>Deploy / List Your Project</h4>
                    <p style={{ color: "#c7c4d7", fontSize: "15px", margin: 0 }}>Use the launch form to add your project description, source links, tags, and start collecting support views.</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: "0 0 8px 0" }}>Track Dashboard Metrics</h4>
                    <p style={{ color: "#c7c4d7", fontSize: "15px", margin: 0 }}>Monitor page views, daily upvotes charts, and review the feedback submitted by users.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* Workspace Dashboard Screen - Visible post authentication */
        <div style={{ flex: 1, display: "flex", width: "100%", maxWidth: "1280px", margin: "0 auto", overflow: "hidden" }} className="animate-fade">
          {/* Sidebar Nav */}
          <aside style={{ width: "240px", borderRight: "1px solid rgba(255, 255, 255, 0.05)", padding: "32px 24px", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Categories</h2>
            <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {availableTags.map(tag => (
                <a 
                  href="#" 
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px", borderRadius: "8px", textDecoration: "none",
                    background: selectedTag === tag ? "rgba(99, 102, 241, 0.08)" : "transparent",
                    border: selectedTag === tag ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                    color: selectedTag === tag ? "#c0c1ff" : "#c7c4d7",
                    transition: "all 0.2s"
                  }}
                >
                  <span>{tag === "All" ? "All Projects" : tag}</span>
                  <span style={{ fontSize: "12px", opacity: 0.8 }}>{getCategoryCount(tag)}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Feed Area */}
          <main style={{ flex: 1, padding: "32px", minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
              <div>
                <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", margin: "0 0 4px 0" }}>Discovery Feed</h1>
                <p style={{ color: "#c7c4d7", fontSize: "14px", margin: 0 }}>Discover the latest Micro-SaaS tools built by indie hackers.</p>
              </div>
              <div style={{ display: "flex", background: "#111116", borderRadius: "8px", padding: "4px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <button className="btn-primary" style={{ padding: "6px 16px", borderRadius: "6px", fontSize: "12px", boxShadow: "none" }}>Newest</button>
                <button style={{ padding: "6px 16px", background: "none", border: "none", color: "#c7c4d7", cursor: "pointer", fontSize: "12px" }}>Trending</button>
              </div>
            </div>

            {/* Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {filteredProjects.map(proj => (
                <article 
                  key={proj.id} 
                  className="glass-panel"
                  onClick={() => setActiveProject(proj)}
                  style={{ padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", height: "240px", cursor: "pointer", justifyContent: "space-between" }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                          🚀
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#fff" }}>{proj.name}</h3>
                          <span className="tag-badge" style={{ marginTop: "4px", display: "inline-block" }}>
                            {proj.tags[0]}
                          </span>
                        </div>
                      </div>

                      {/* Upvote */}
                      <div 
                        onClick={(e) => handleVote(proj.id, e)}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "center",
                          background: proj.hasVoted ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.02)",
                          border: proj.hasVoted ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "8px", padding: "6px 10px", cursor: "pointer"
                        }}
                      >
                        <span style={{ fontSize: "11px", color: "#c0c1ff" }}>▲</span>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>{proj.upvotes}</span>
                      </div>
                    </div>

                    <p style={{ color: "#c7c4d7", fontSize: "14px", marginTop: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {proj.tagline}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                    <span style={{ fontSize: "12px", color: "#c7c4d7" }}>by @{proj.creatorGithub}</span>
                    <span style={{ fontSize: "12px", color: "#06B6D4", fontWeight: "600", fontFamily: "JetBrains Mono" }}>$2.4k/mo</span>
                  </div>
                </article>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(5, 5, 8, 0.85)", backdropFilter: "blur(16px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 120
        }} onClick={() => setShowAuthModal(false)}>
          <div 
            className="glass-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "450px", padding: "36px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: 0 }}>
                {isSignUp ? "Create Account" : "Access Workspace"}
              </h3>
              <button onClick={() => setShowAuthModal(false)} style={{ background: "none", border: "none", color: "#c7c4d7", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>

            {/* Provider Auth Options */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button 
                onClick={() => handleProviderLogin("Google")}
                style={{
                  padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255, 255, 255, 0.02)", color: "white", fontWeight: "600",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", fontSize: "13px"
                }}
              >
                🔴 Google
              </button>
              <button 
                onClick={() => handleProviderLogin("GitHub")}
                style={{
                  padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255, 255, 255, 0.02)", color: "white", fontWeight: "600",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", fontSize: "13px"
                }}
              >
                🐱 GitHub
              </button>
              <button 
                onClick={() => handleProviderLogin("Apple")}
                style={{
                  padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255, 255, 255, 0.02)", color: "white", fontWeight: "600",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", fontSize: "13px"
                }}
              >
                🍏 Apple ID
              </button>
              <button 
                onClick={() => handleProviderLogin("Hotmail")}
                style={{
                  padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255, 255, 255, 0.02)", color: "white", fontWeight: "600",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", fontSize: "13px"
                }}
              >
                📧 Hotmail
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#64748b" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }}></div>
              <span style={{ fontSize: "11px" }}>OR CONTINUE WITH EMAIL</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }}></div>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {isSignUp && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", color: "#c7c4d7" }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe"
                    required
                    className="cyber-input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "#c7c4d7" }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. email@example.com"
                  required
                  className="cyber-input"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "#c7c4d7" }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="cyber-input"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: "12px", fontSize: "14px", marginTop: "8px" }}>
                {isSignUp ? "Create Account" : "Access Workspace"}
              </button>
            </form>

            <div style={{ textAlign: "center", fontSize: "13px", color: "#c7c4d7" }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <span 
                onClick={() => { setIsSignUp(!isSignUp); resetAuthFields(); }}
                style={{ color: "#c0c1ff", cursor: "pointer", fontWeight: "600" }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {activeProject && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(5, 5, 8, 0.8)", backdropFilter: "blur(16px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100
        }} onClick={() => setActiveProject(null)}>
          <div 
            className="glass-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "650px", maxHeight: "90vh", overflowY: "auto",
              padding: "40px", position: "relative", borderRadius: "16px"
            }}
          >
            {/* Close */}
            <button 
              onClick={() => setActiveProject(null)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#c7c4d7", cursor: "pointer", fontSize: "20px" }}
            >
              ✕
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", margin: "0 0 6px 0" }}>{activeProject.name}</h2>
                <p style={{ color: "#06B6D4", fontSize: "14px", margin: 0, fontFamily: "Geist" }}>{activeProject.tagline}</p>
              </div>
              <button 
                onClick={(e) => handleVote(activeProject.id, e)}
                style={{
                  background: activeProject.hasVoted ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${activeProject.hasVoted ? "#6366f1" : "rgba(255,255,255,0.08)"}`,
                  color: "#c0c1ff", borderRadius: "8px", padding: "10px 18px",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700"
                }}
              >
                <span>▲ Upvote</span>
                <span>{activeProject.upvotes}</span>
              </button>
            </div>

            <p style={{ color: "#c7c4d7", fontSize: "15px", lineHeight: "1.6", marginBottom: "28px" }}>
              {activeProject.description}
            </p>

            {/* Links and Actions */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "36px" }}>
              <a href={activeProject.github} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1 }}>
                <button style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#161622", border: "1px solid rgba(255,255,255,0.08)", color: "white", cursor: "pointer", fontWeight: "600" }}>
                  💻 GitHub Source
                </button>
              </a>
              {activeProject.website && (
                <a href={activeProject.website} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1 }}>
                  <button className="btn-primary" style={{ width: "100%", padding: "12px", borderRadius: "8px", cursor: "pointer" }}>
                    🚀 Visit Live Site
                  </button>
                </a>
              )}
              <button 
                onClick={() => setShowAnalyticsModal(true)}
                style={{ padding: "12px 16px", borderRadius: "8px", background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.25)", color: "#22d3ee", cursor: "pointer", fontWeight: "600" }}
              >
                📊 Insights Stats
              </button>
            </div>

            {/* Discussion Section */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#fff" }}>Discussions</h3>
              
              <form onSubmit={handleAddComment} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input 
                  type="text" 
                  placeholder="Ask a question or leave feedback..."
                  className="cyber-input"
                  style={{ flex: 1 }}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: "0 20px", borderRadius: "8px" }}>
                  Comment
                </button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeProject.comments.map(c => (
                  <div key={c.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: "12px 16px", borderRadius: "8px" }}>
                    <div style={{ fontWeight: "600", fontSize: "13px", color: "#c0c1ff", marginBottom: "4px" }}>@{c.user}</div>
                    <div style={{ fontSize: "14px", color: "#c7c4d7" }}>{c.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && activeProject && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(5, 5, 8, 0.85)", backdropFilter: "blur(16px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 110
        }} onClick={() => setShowAnalyticsModal(false)}>
          <div 
            className="glass-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "500px", padding: "30px", borderRadius: "16px", position: "relative" }}
          >
            <button 
              onClick={() => setShowAnalyticsModal(false)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#c7c4d7", cursor: "pointer", fontSize: "18px" }}
            >
              ✕
            </button>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "20px", color: "#fff" }}>{activeProject.name} Insights</h3>
            <p style={{ color: "#c7c4d7", fontSize: "13px", margin: "0 0 20px 0" }}>Metrics tracked over last 7 days</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div style={{ background: "rgba(255,255,255,0.01)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#c7c4d7", fontSize: "12px" }}>Total Views</div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#06B6D4" }}>{activeProject.analytics.views}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.01)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#c7c4d7", fontSize: "12px" }}>Upvote Conversion</div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#c0c1ff" }}>
                  {Math.round((activeProject.upvotes / activeProject.analytics.views) * 100)}%
                </div>
              </div>
            </div>

            {/* Sparkline Graph (SVG) */}
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#c7c4d7" }}>Luminescent Growth Velocity</h4>
            <div style={{ background: "rgba(255,255,255,0.01)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
              <svg viewBox="0 0 300 100" style={{ width: "100%", height: "80px", overflow: "visible" }}>
                <path
                  d={`M 10 ${100 - activeProject.analytics.dailyUpvotes[0] * 2} 
                     L 50 ${100 - activeProject.analytics.dailyUpvotes[1] * 2} 
                     L 90 ${100 - activeProject.analytics.dailyUpvotes[2] * 2} 
                     L 130 ${100 - activeProject.analytics.dailyUpvotes[3] * 2} 
                     L 170 ${100 - activeProject.analytics.dailyUpvotes[4] * 2} 
                     L 210 ${100 - activeProject.analytics.dailyUpvotes[5] * 2} 
                     L 290 ${100 - activeProject.analytics.dailyUpvotes[6] * 2}`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Dots */}
                {activeProject.analytics.dailyUpvotes.map((val, idx) => {
                  const x = idx === 6 ? 290 : 10 + idx * 40;
                  const y = 100 - val * 2;
                  return (
                    <circle key={idx} cx={x} cy={y} r="4" fill="#06B6D4" />
                  );
                })}
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#c7c4d7", marginTop: "8px" }}>
                <span>Day 1</span>
                <span>Day 4</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Launch Product Modal */}
      {showLaunchModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(5, 5, 8, 0.8)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100
        }} onClick={() => setShowLaunchModal(false)}>
          <form 
            onSubmit={handleLaunch}
            className="glass-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "550px", maxHeight: "90vh", overflowY: "auto",
              padding: "40px", position: "relative",
              display: "flex", flexDirection: "column", gap: "16px", borderRadius: "16px"
            }}
          >
            <button 
              type="button"
              onClick={() => setShowLaunchModal(false)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#c7c4d7", cursor: "pointer", fontSize: "20px" }}
            >
              ✕
            </button>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", margin: 0 }}>Launch your Startup</h2>
            <p style={{ color: "#c7c4d7", fontSize: "13px", margin: "0 0 10px 0" }}>Share your product with hundreds of active developers.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Startup Name *</label>
              <input 
                type="text" 
                placeholder="e.g. CodeForge"
                required
                className="cyber-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Short Tagline *</label>
              <input 
                type="text" 
                placeholder="e.g. Build API integrations in under 5 minutes"
                required
                className="cyber-input"
                value={newTagline}
                onChange={(e) => setNewTagline(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Deep-dive Description *</label>
              <textarea 
                placeholder="What problem does it solve? Who is it for?"
                required
                rows={4}
                style={{ resize: "none", fontFamily: "inherit" }}
                className="cyber-input"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Category Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. AI, SaaS, Developer Tools"
                className="cyber-input"
                value={newTagsString}
                onChange={(e) => setNewTagsString(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>GitHub Repo Link</label>
                <input 
                  type="url" 
                  placeholder="https://github.com/..."
                  className="cyber-input"
                  value={newGithub}
                  onChange={(e) => setNewGithub(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Live URL</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  className="cyber-input"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: "14px", borderRadius: "8px", cursor: "pointer", marginTop: "10px" }}>
              Submit Startup To Feed 🚀
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "#060609", padding: "24px"
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          maxWidth: "1280px", margin: "0 auto"
        }}>
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#fff", margin: "0 0 4px 0" }}>Launchpad</h4>
            <p style={{ color: "#c7c4d7", fontSize: "12px", margin: 0 }}>© 2026 Launchpad Micro-SaaS. All rights reserved.</p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#" style={{ color: "#c7c4d7", fontSize: "12px", textDecoration: "none" }}>Terms</a>
            <a href="#" style={{ color: "#c7c4d7", fontSize: "12px", textDecoration: "none" }}>Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

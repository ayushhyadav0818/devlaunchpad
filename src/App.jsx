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
  
  // Launch Form State
  const [newName, setNewName] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTagsString, setNewTagsString] = useState("");
  const [newGithub, setNewGithub] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newCreator, setNewCreator] = useState("ayushyadav");

  // Comment State
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    setProjects(getProjects());
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
      creator: newCreator,
      creatorGithub: "ayushhyadav0818"
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
    const updated = addComment(activeProject.id, commentText, "Innovator Guest");
    setProjects(updated);
    setActiveProject(updated.find(p => p.id === activeProject.id));
    setCommentText("");
  };

  // Extract all unique tags
  const allTags = ["All", ...new Set(projects.flatMap(p => p.tags))];

  // Filtering projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(11, 15, 25, 0.8)", sticky: "top", zIndex: 10, backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            background: "linear-gradient(135deg, #6366f1, #a5b4fc)",
            width: "32px", height: "32px", borderRadius: "8px",
            display: "inline-block", boxShadow: "0 0 15px rgba(99,102,241,0.5)"
          }}></span>
          <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px" }}>
            Dev<span style={{ color: "#818cf8" }}>Launch</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button 
            className="gradient-btn" 
            onClick={() => setShowLaunchModal(true)}
            style={{ padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}
          >
            + Launch Product
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ textAlign: "center", padding: "60px 20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 className="gradient-text" style={{ fontSize: "56px", fontWeight: "800", margin: "0 0 16px 0", letterSpacing: "-1.5px", lineHeight: "1.1" }}>
          The Startup Launchpad For Developers
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "18px", margin: "0 auto 32px auto", maxWidth: "600px" }}>
          Discover, upvote, and discuss cutting-edge micro-SaaS and developer products launched daily by tech enthusiasts.
        </p>

        {/* Search and Tag filter wrapper */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "30px", flexWrap: "wrap" }}>
          <input 
            type="text" 
            placeholder="Search products..."
            className="glass-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "320px", fontSize: "15px" }}
          />
        </div>

        {/* Tag Filters */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              style={{
                background: selectedTag === tag ? "#6366f1" : "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "white",
                padding: "6px 14px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
                transition: "all 0.2s"
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      {/* Project Grid */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 30px" }}>
        {filteredProjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
            <h3>No products found under "{selectedTag}"</h3>
            <p>Be the first to launch a product in this category!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {filteredProjects.map(proj => (
              <div 
                key={proj.id} 
                className="glow-card" 
                onClick={() => setActiveProject(proj)}
                style={{ padding: "24px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "230px" }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <img src={proj.avatar} alt={proj.creator} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                      <div>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>{proj.name}</h3>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>by @{proj.creatorGithub}</span>
                      </div>
                    </div>
                    {/* Upvote Button */}
                    <button 
                      onClick={(e) => handleVote(proj.id, e)}
                      style={{
                        background: proj.hasVoted ? "#6366f1" : "rgba(99, 102, 241, 0.1)",
                        border: `1px solid ${proj.hasVoted ? "#6366f1" : "rgba(99, 102, 241, 0.3)"}`,
                        color: proj.hasVoted ? "white" : "#a5b4fc",
                        borderRadius: "10px",
                        padding: "6px 12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                        fontWeight: "700",
                        width: "48px"
                      }}
                    >
                      <span style={{ fontSize: "10px" }}>▲</span>
                      <span style={{ fontSize: "14px" }}>{proj.upvotes}</span>
                    </button>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 16px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {proj.tagline}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {proj.tags.slice(0, 2).map(t => (
                      <span key={t} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", color: "#cbd5e1" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span style={{ color: "#6366f1", fontSize: "13px", fontWeight: "600" }}>View Details →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Project Details Modal */}
      {activeProject && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(3, 7, 18, 0.8)", backdropFilter: "blur(8px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100
        }} onClick={() => setActiveProject(null)}>
          <div 
            className="glow-card" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "650px", maxHeight: "90vh", overflowY: "auto",
              padding: "40px", position: "relative", background: "#0f172a"
            }}
          >
            {/* Close */}
            <button 
              onClick={() => setActiveProject(null)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "20px" }}
            >
              ✕
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "28px", fontWeight: "800", margin: "0 0 4px 0" }}>{activeProject.name}</h2>
                <p style={{ color: "#818cf8", fontSize: "15px", margin: 0 }}>{activeProject.tagline}</p>
              </div>
              <button 
                onClick={(e) => handleVote(activeProject.id, e)}
                style={{
                  background: activeProject.hasVoted ? "#6366f1" : "rgba(99, 102, 241, 0.1)",
                  border: `1px solid ${activeProject.hasVoted ? "#6366f1" : "rgba(99, 102, 241, 0.3)"}`,
                  color: activeProject.hasVoted ? "white" : "#a5b4fc",
                  borderRadius: "12px",
                  padding: "10px 18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "700"
                }}
              >
                <span>▲ Upvote</span>
                <span>{activeProject.upvotes}</span>
              </button>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}>
              {activeProject.description}
            </p>

            {/* Links and Actions */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
              <a href={activeProject.github} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1 }}>
                <button style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", color: "white", cursor: "pointer", fontWeight: "600" }}>
                  💻 GitHub Repo
                </button>
              </a>
              {activeProject.website && (
                <a href={activeProject.website} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1 }}>
                  <button className="gradient-btn" style={{ width: "100%", padding: "12px", borderRadius: "10px", cursor: "pointer" }}>
                    🚀 Visit Website
                  </button>
                </a>
              )}
              <button 
                onClick={() => setShowAnalyticsModal(true)}
                style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#34d399", cursor: "pointer", fontWeight: "600" }}
              >
                📊 Analytics
              </button>
            </div>

            {/* Comments Section */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>Discussion ({activeProject.comments.length})</h3>
              
              <form onSubmit={handleAddComment} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input 
                  type="text" 
                  placeholder="Ask a question or leave feedback..."
                  className="glass-input"
                  style={{ flex: 1 }}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" style={{ background: "#6366f1", border: "none", color: "white", padding: "0 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                  Comment
                </button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeProject.comments.map(c => (
                  <div key={c.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: "12px 16px", borderRadius: "8px" }}>
                    <div style={{ fontWeight: "600", fontSize: "13px", color: "#a5b4fc", marginBottom: "4px" }}>@{c.user}</div>
                    <div style={{ fontSize: "14px", color: "#cbd5e1" }}>{c.text}</div>
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
          background: "rgba(3, 7, 18, 0.85)", backdropFilter: "blur(10px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 110
        }} onClick={() => setShowAnalyticsModal(false)}>
          <div 
            className="glow-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "500px", padding: "30px", background: "#0f172a", position: "relative" }}
          >
            <button 
              onClick={() => setShowAnalyticsModal(false)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "18px" }}
            >
              ✕
            </button>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "20px" }}>{activeProject.name} Insights</h3>
            <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 20px 0" }}>Metrics tracked over last 7 days</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "#64748b", fontSize: "12px" }}>Total Views</div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#38bdf8" }}>{activeProject.analytics.views}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "#64748b", fontSize: "12px" }}>Upvote Conversion</div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#34d399" }}>
                  {Math.round((activeProject.upvotes / activeProject.analytics.views) * 100)}%
                </div>
              </div>
            </div>

            {/* Sparkline Graph (SVG) */}
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#94a3b8" }}>Upvotes Progress</h4>
            <div style={{ background: "rgba(255,255,255,0.01)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.04)" }}>
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
                    <circle key={idx} cx={x} cy={y} r="4" fill="#818cf8" />
                  );
                })}
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#64748b", marginTop: "8px" }}>
                <span>Day 1</span>
                <span>Day 3</span>
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
          background: "rgba(3, 7, 18, 0.8)", backdropFilter: "blur(8px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100
        }} onClick={() => setShowLaunchModal(false)}>
          <form 
            onSubmit={handleLaunch}
            className="glow-card" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "550px", maxHeight: "90vh", overflowY: "auto",
              padding: "40px", position: "relative", background: "#0f172a",
              display: "flex", flexDirection: "column", gap: "16px"
            }}
          >
            <button 
              type="button"
              onClick={() => setShowLaunchModal(false)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "20px" }}
            >
              ✕
            </button>
            <h2 style={{ fontSize: "24px", fontWeight: "800", margin: 0 }}>Launch your Startup</h2>
            <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 10px 0" }}>Share your project with hundreds of active developers.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Startup Name *</label>
              <input 
                type="text" 
                placeholder="e.g. CodeForge"
                className="glass-input"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Short Tagline *</label>
              <input 
                type="text" 
                placeholder="e.g. Build API integrations in under 5 minutes"
                className="glass-input"
                required
                value={newTagline}
                onChange={(e) => setNewTagline(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Deep-dive Description *</label>
              <textarea 
                placeholder="What problem does it solve? Who is it for? Key integrations?"
                className="glass-input"
                required
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                style={{ resize: "none", fontFamily: "inherit" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Category Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. AI, SaaS, Developer Tools"
                className="glass-input"
                value={newTagsString}
                onChange={(e) => setNewTagsString(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>GitHub Repo Link</label>
                <input 
                  type="url" 
                  placeholder="https://github.com/..."
                  className="glass-input"
                  value={newGithub}
                  onChange={(e) => setNewGithub(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Live URL</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  className="glass-input"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="gradient-btn" style={{ padding: "14px", borderRadius: "10px", cursor: "pointer", marginTop: "10px" }}>
              Submit Startup To Feed 🚀
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

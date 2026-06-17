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
      creator: "Ayush Yadav",
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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#131314", color: "#e5e2e3" }}>
      {/* Top Navbar */}
      <nav style={{
        position: "sticky", top: 0, width: "100%", zIndex: 50,
        background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          height: "64px", padding: "0 24px", maxWidth: "1280px", margin: "0 auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <a href="#" style={{ fontSize: "22px", fontWeight: "800", textDecoration: "none", color: "#c0c1ff" }}>
              Launchpad
            </a>
            <div style={{ display: "flex", gap: "24px" }}>
              <a href="#" style={{ color: "#c0c1ff", fontWeight: "700", borderBottom: "2px solid #c0c1ff", paddingBottom: "4px", textDecoration: "none" }}>Explore</a>
              <a href="#" onClick={() => setShowLaunchModal(true)} style={{ color: "#c7c4d7", textDecoration: "none" }}>Submit</a>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <input 
                type="text" 
                placeholder="Search projects..."
                className="cyber-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "36px", width: "240px", fontSize: "14px" }}
              />
              <span style={{ position: "absolute", left: "12px", top: "10px", color: "#c7c4d7", fontSize: "14px" }}>🔍</span>
            </div>
            <button 
              className="btn-primary" 
              onClick={() => setShowLaunchModal(true)}
              style={{ padding: "8px 20px", fontSize: "13px" }}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout Body */}
      <div style={{ flex: 1, display: "flex", width: "100%", maxWidth: "1280px", margin: "0 auto", overflow: "hidden" }}>
        
        {/* Sidebar Nav */}
        <aside style={{ width: "240px", borderRight: "1px solid rgba(255, 255, 255, 0.08)", padding: "24px", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "12px", fontWeight: "600", color: "#c7c4d7", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Categories</h2>
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {availableTags.map(tag => (
              <a 
                href="#" 
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 12px", borderRadius: "8px", textDecoration: "none",
                  background: selectedTag === tag ? "rgba(255,255,255,0.05)" : "transparent",
                  border: selectedTag === tag ? "1px solid rgba(192,193,255,0.3)" : "1px solid transparent",
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
        <main style={{ flex: 1, padding: "24px", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", margin: "0 0 4px 0" }}>Discovery Feed</h1>
              <p style={{ color: "#c7c4d7", fontSize: "14px", margin: 0 }}>Discover the latest Micro-SaaS tools built by indie hackers.</p>
            </div>
            <div style={{ display: "flex", background: "#201f20", borderRadius: "8px", padding: "4px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <button className="btn-primary" style={{ padding: "6px 16px", borderRadius: "6px", fontSize: "12px" }}>Newest</button>
              <button style={{ padding: "6px 16px", background: "none", border: "none", color: "#c7c4d7", cursor: "pointer", fontSize: "12px" }}>Trending</button>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {filteredProjects.map(proj => (
              <article 
                key={proj.id} 
                className="surface-level-1 interactive-glow"
                onClick={() => setActiveProject(proj)}
                style={{ padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", height: "240px", cursor: "pointer", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", itemsCenter: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                        🚀
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#fff" }}>{proj.name}</h3>
                        <span style={{ fontSize: "10px", background: "rgba(6,182,212,0.15)", color: "#06B6D4", padding: "2px 6px", borderRadius: "4px" }}>
                          {proj.tags[0]}
                        </span>
                      </div>
                    </div>

                    {/* Upvote */}
                    <div 
                      onClick={(e) => handleVote(proj.id, e)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        background: proj.hasVoted ? "rgba(192, 193, 255, 0.15)" : "#201f20",
                        border: proj.hasVoted ? "1px solid #c0c1ff" : "1px solid rgba(255,255,255,0.08)",
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
                  <span style={{ fontSize: "12px", color: "#06B6D4", fontWeight: "600" }}>$2.4k/mo</span>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>

      {/* Project Details Modal */}
      {activeProject && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(14, 14, 15, 0.8)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100
        }} onClick={() => setActiveProject(null)}>
          <div 
            className="surface-level-1 surface-level-2" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "650px", maxHeight: "90vh", overflowY: "auto",
              padding: "40px", position: "relative", borderRadius: "12px"
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
                  background: activeProject.hasVoted ? "rgba(192, 193, 255, 0.2)" : "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(192, 193, 255, 0.3)",
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
                <button style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#1c1b1c", border: "1px solid rgba(255,255,255,0.08)", color: "white", cursor: "pointer", fontWeight: "600" }}>
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
                style={{ padding: "12px 16px", borderRadius: "8px", background: "rgba(76, 215, 246, 0.1)", border: "1px solid rgba(76, 215, 246, 0.3)", color: "#4cd7f6", cursor: "pointer", fontWeight: "600" }}
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
                  style={{
                    flex: 1, background: "#000", border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px", color: "white", padding: "10px 14px", outline: "none"
                  }}
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
          background: "rgba(14, 14, 15, 0.85)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 110
        }} onClick={() => setShowAnalyticsModal(false)}>
          <div 
            className="surface-level-1 surface-level-2" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "500px", padding: "30px", borderRadius: "12px", position: "relative" }}
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
          background: "rgba(14, 14, 15, 0.8)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100
        }} onClick={() => setShowLaunchModal(false)}>
          <form 
            onSubmit={handleLaunch}
            className="surface-level-1 surface-level-2" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "550px", maxHeight: "90vh", overflowY: "auto",
              padding: "40px", position: "relative",
              display: "flex", flexDirection: "column", gap: "16px", borderRadius: "12px"
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
                style={{ background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px" }}
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
                style={{ background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px" }}
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
                style={{ background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px", resize: "none", fontFamily: "inherit" }}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Category Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. AI, SaaS, Developer Tools"
                style={{ background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px" }}
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
                  style={{ background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px" }}
                  value={newGithub}
                  onChange={(e) => setNewGithub(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Live URL</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  style={{ background: "#000", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px" }}
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
        marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "#0E0E0F", padding: "24px"
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

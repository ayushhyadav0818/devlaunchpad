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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0A0A0B", color: "#e5e2e3" }}>
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
            <a href="#" style={{
              fontSize: "24px", fontWeight: "800", textDecoration: "none",
              color: "#c0c1ff", textShadow: "0 0 15px rgba(99,102,241,0.4)"
            }}>
              Launchpad
            </a>
            <div style={{ display: "flex", gap: "24px" }} className="hidden-mobile">
              <a href="#" style={{ color: "#c0c1ff", fontWeight: "700", borderBottom: "2px solid #c0c1ff", paddingBottom: "4px", textDecoration: "none" }}>Explore</a>
              <a href="#" onClick={() => setShowLaunchModal(true)} style={{ color: "#c7c4d7", textDecoration: "none", transition: "color 0.2s" }}>Submit</a>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "#000", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px", padding: "8px 12px 8px 32px", color: "#e5e2e3",
                  fontSize: "14px", outline: "none", transition: "all 0.2s"
                }}
              />
              <span style={{ position: "absolute", left: "10px", top: "10px", color: "#c7c4d7", fontSize: "14px" }}>🔍</span>
            </div>
            <button 
              className="btn-primary" 
              onClick={() => setShowLaunchModal(true)}
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              Submit Project
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ position: "relative", paddingTop: "80px", paddingBottom: "120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "450px", overflow: "hidden" }}>
        <div className="grid-bg" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}></div>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "600px", height: "600px", background: "rgba(192, 193, 255, 0.08)",
          borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none"
        }}></div>

        <div style={{ relative: "z-10", maxWidth: "1280px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "4px 12px", borderRadius: "999px", background: "rgba(76, 215, 246, 0.1)",
            border: "1px solid rgba(76, 215, 246, 0.2)", color: "#4cd7f6",
            marginBottom: "32px", fontFamily: "Geist", fontSize: "12px", fontWeight: "600", textTransform: "uppercase"
          }}>
            <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#4cd7f6" }}></span>
            System Operational
          </div>

          <h1 className="glow-text" style={{ fontSize: "52px", fontWeight: "800", color: "#fff", marginBottom: "24px", lineHeight: "1.15", letterSpacing: "-0.03em" }}>
            Launch into the Synthetic Era. <br/>
            <span style={{ color: "#c0c1ff" }}>Discover, upvote, and scale.</span>
          </h1>

          <p style={{ color: "#c7c4d7", maxWidth: "650px", margin: "0 auto 40px auto", fontSize: "18px", lineHeight: "1.6" }}>
            The premier destination for the next generation of Micro-SaaS. Connect with visionary founders, deep-tech investors, and early adopters in a high-density, high-velocity ecosystem.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <button 
              className="btn-primary" 
              onClick={() => {
                const element = document.getElementById("explore-section");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ padding: "14px 32px", fontSize: "16px" }}
            >
              Start Exploring
            </button>
            <button 
              className="glass-modal" 
              onClick={() => setShowLaunchModal(true)}
              style={{ padding: "14px 32px", fontSize: "16px", color: "#c0c1ff", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}
            >
              Submit Project
            </button>
          </div>
        </div>
      </main>

      {/* Explore Section */}
      <section id="explore-section" style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px", width: "100%" }}>
        {/* Filter tags header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "16px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#fff" }}>Trending Launches</h2>
          
          <div style={{ display: "flex", gap: "8px" }}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  background: selectedTag === tag ? "#c0c1ff" : "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: selectedTag === tag ? "#1000a9" : "#e5e2e3",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s"
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Content grid */}
        {filteredProjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#c7c4d7" }}>
            <h3>No products found under this category</h3>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {filteredProjects.map(proj => (
              <div 
                key={proj.id} 
                className="glass-panel" 
                onClick={() => setActiveProject(proj)}
                style={{ padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", height: "360px", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ width: "100%", height: "160px", borderRadius: "6px", background: "#1c1b1c", overflow: "hidden", position: "relative", marginBottom: "16px" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom right, rgba(192, 193, 255, 0.2), rgba(76, 215, 246, 0.1))", opacity: 0.5 }}></div>
                    <img 
                      src={proj.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350"} 
                      alt={proj.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#fff" }}>{proj.name}</h3>
                    <div 
                      onClick={(e) => handleVote(proj.id, e)}
                      style={{
                        background: proj.hasVoted ? "rgba(192, 193, 255, 0.25)" : "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(192, 193, 255, 0.3)",
                        color: "#c0c1ff", borderRadius: "4px", padding: "4px 8px",
                        display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700"
                      }}
                    >
                      <span>▲</span>
                      <span>{proj.upvotes}</span>
                    </div>
                  </div>
                  <p style={{ color: "#c7c4d7", fontSize: "14px", margin: "0 0 12px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {proj.tagline}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {proj.tags.map(t => (
                      <span key={t} className="tag-badge">{t}</span>
                    ))}
                  </div>
                  <span style={{ color: "#4cd7f6", fontSize: "13px", fontWeight: "600" }}>View Project →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Project Details Modal */}
      {activeProject && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(14, 14, 15, 0.8)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100
        }} onClick={() => setActiveProject(null)}>
          <div 
            className="glass-panel glass-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "680px", maxHeight: "90vh", overflowY: "auto",
              padding: "40px", position: "relative", background: "#131314"
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
                <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", margin: "0 0 6px 0" }}>{activeProject.name}</h2>
                <p style={{ color: "#4cd7f6", fontSize: "15px", margin: 0, fontFamily: "Geist" }}>{activeProject.tagline}</p>
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

            <p style={{ color: "#c7c4d7", fontSize: "16px", lineHeight: "1.6", marginBottom: "28px" }}>
              {activeProject.description}
            </p>

            {/* Links and Actions */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "36px" }}>
              <a href={activeProject.github} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1 }}>
                <button style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#1c1b1c", border: "1px solid rgba(255,255,255,0.08)", color: "white", cursor: "pointer", fontWeight: "600" }}>
                  💻 GitHub Source Code
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
                📈 Live Stats
              </button>
            </div>

            {/* Discussion Section */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#fff" }}>Discussion Board</h3>
              
              <form onSubmit={handleAddComment} style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                <input 
                  type="text" 
                  placeholder="Leave detailed feedback or ask questions..."
                  style={{
                    flex: 1, background: "#0e0e0f", border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px", color: "white", padding: "10px 14px", outline: "none"
                  }}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: "0 20px", borderRadius: "8px" }}>
                  Post Comment
                </button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeProject.comments.map(c => (
                  <div key={c.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: "14px 18px", borderRadius: "8px" }}>
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
            className="glass-panel glass-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "520px", padding: "30px", background: "#131314", position: "relative" }}
          >
            <button 
              onClick={() => setShowAnalyticsModal(false)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#c7c4d7", cursor: "pointer", fontSize: "18px" }}
            >
              ✕
            </button>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "20px", color: "#fff" }}>{activeProject.name} Performance</h3>
            <p style={{ color: "#c7c4d7", fontSize: "13px", margin: "0 0 24px 0" }}>Developer dashboard visitor analytics</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div style={{ background: "rgba(255,255,255,0.01)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#c7c4d7", fontSize: "12px" }}>Unique Pageviews</div>
                <div style={{ fontSize: "26px", fontWeight: "700", color: "#4cd7f6" }}>{activeProject.analytics.views}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.01)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#c7c4d7", fontSize: "12px" }}>Conversion Upvotes</div>
                <div style={{ fontSize: "26px", fontWeight: "700", color: "#c0c1ff" }}>
                  {Math.round((activeProject.upvotes / activeProject.analytics.views) * 100)}%
                </div>
              </div>
            </div>

            {/* Sparkline Graph (SVG) */}
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#c7c4d7" }}>Luminescent Growth Velocity</h4>
            <div style={{ background: "rgba(255,255,255,0.01)", padding: "20px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
              <svg viewBox="0 0 300 100" style={{ width: "100%", height: "90px", overflow: "visible" }}>
                <path
                  d={`M 10 ${100 - activeProject.analytics.dailyUpvotes[0] * 2} 
                     L 50 ${100 - activeProject.analytics.dailyUpvotes[1] * 2} 
                     L 90 ${100 - activeProject.analytics.dailyUpvotes[2] * 2} 
                     L 130 ${100 - activeProject.analytics.dailyUpvotes[3] * 2} 
                     L 170 ${100 - activeProject.analytics.dailyUpvotes[4] * 2} 
                     L 210 ${100 - activeProject.analytics.dailyUpvotes[5] * 2} 
                     L 290 ${100 - activeProject.analytics.dailyUpvotes[6] * 2}`}
                  fill="none"
                  stroke="#4cd7f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Neon glow effect */}
                <path
                  d={`M 10 ${100 - activeProject.analytics.dailyUpvotes[0] * 2} 
                     L 50 ${100 - activeProject.analytics.dailyUpvotes[1] * 2} 
                     L 90 ${100 - activeProject.analytics.dailyUpvotes[2] * 2} 
                     L 130 ${100 - activeProject.analytics.dailyUpvotes[3] * 2} 
                     L 170 ${100 - activeProject.analytics.dailyUpvotes[4] * 2} 
                     L 210 ${100 - activeProject.analytics.dailyUpvotes[5] * 2} 
                     L 290 ${100 - activeProject.analytics.dailyUpvotes[6] * 2}`}
                  fill="none"
                  stroke="#4cd7f6"
                  strokeWidth="8"
                  opacity="0.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: "blur(4px)" }}
                />
                {/* Dots */}
                {activeProject.analytics.dailyUpvotes.map((val, idx) => {
                  const x = idx === 6 ? 290 : 10 + idx * 40;
                  const y = 100 - val * 2;
                  return (
                    <circle key={idx} cx={x} cy={y} r="5" fill="#c0c1ff" />
                  );
                })}
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#c7c4d7", marginTop: "12px" }}>
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
            className="glass-panel glass-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "560px", maxHeight: "90vh", overflowY: "auto",
              padding: "40px", position: "relative", background: "#131314",
              display: "flex", flexDirection: "column", gap: "18px"
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
            <p style={{ color: "#c7c4d7", fontSize: "13px", margin: "0 0 10px 0" }}>Publish your product in front of active developers and investors.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Startup Name *</label>
              <input 
                type="text" 
                placeholder="e.g. NexusGraph"
                required
                style={{ background: "#0e0e0f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px" }}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Tagline *</label>
              <input 
                type="text" 
                placeholder="e.g. Neural-net powered knowledge graph engine"
                required
                style={{ background: "#0e0e0f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px" }}
                value={newTagline}
                onChange={(e) => setNewTagline(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Detailed Description *</label>
              <textarea 
                placeholder="Details of your Micro-SaaS. Key features, roadmap..."
                required
                rows={4}
                style={{ background: "#0e0e0f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px", resize: "none", fontFamily: "inherit" }}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. AI, Database, Developer Tools"
                style={{ background: "#0e0e0f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px" }}
                value={newTagsString}
                onChange={(e) => setNewTagsString(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>GitHub URL</label>
                <input 
                  type="url" 
                  placeholder="https://github.com/..."
                  style={{ background: "#0e0e0f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px" }}
                  value={newGithub}
                  onChange={(e) => setNewGithub(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#c7c4d7" }}>Live Site URL</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  style={{ background: "#0e0e0f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", padding: "10px" }}
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: "14px", fontSize: "15px", marginTop: "12px" }}>
              Submit Startup To Feed 🚀
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "#0e0e0f", padding: "48px 24px"
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          maxWidth: "1280px", margin: "0 auto", flexWrap: "wrap", gap: "24px"
        }}>
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#fff", margin: "0 0 6px 0" }}>Launchpad</h4>
            <p style={{ color: "#c7c4d7", fontSize: "13px", margin: 0 }}>Building the synthetic future.</p>
          </div>
          <div style={{ fontSize: "12px", color: "#c7c4d7", opacity: 0.8 }}>
            © 2026 Launchpad Micro-SaaS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

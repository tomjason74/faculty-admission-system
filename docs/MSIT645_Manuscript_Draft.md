# TITLE OF THE PAPER
**Faculty Admission and Profiling System: A Digital Transformation Initiative for Streamlined Recruitment and Compliance Tracking**

Presented as a Course Requirement for the Completion of the MSIT 645 IT Strategic Leadership and Strategic Planning

by

**[YOUR FIRST NAME] [YOUR MIDDLE INITIAL]. [YOUR FAMILY NAME]**
Master of Science in Information Technology
Polytechnic University of the Philippines

---

## EXECUTIVE SUMMARY

The Polytechnic University of the Philippines (PUP) relies on its esteemed faculty to deliver quality education. However, the administrative processes surrounding faculty recruitment, onboarding compliance, and end-of-term records management have traditionally been manual and highly decentralized. This results in operational bottlenecks, difficulties in tracking compliance (e.g., Medical Certificates, NBI Clearances), and potential security risks regarding sensitive personnel documents.

To address these challenges and align with the university's vision of becoming a National Polytechnic University through digital transformation, this Re-entry Initiative for Service Excellence (RISE) proposes the implementation of the **Faculty Admission and Profiling System**. 

The system provides a secure, role-based, end-to-end web application built on modern web technologies (Laravel and React). It replaces manual paper-based tracking with a unified dashboard where prospective faculty can submit applications, and Administrators can securely review, approve, and auto-generate credentials. Furthermore, it introduces a "Compliance Tracker" allowing active faculty to manage their ongoing requirements and upload end-of-term class records securely. By automating these workflows, the initiative ensures 100% data integrity, reduces administrative overhead, and guarantees the secure lifecycle management of faculty data from admission to offboarding.

---

## Part I. SITUATIONER

### Organizational Profile
The Polytechnic University of the Philippines (PUP) is a premier state university mandated to provide accessible and quality higher education. The proposed intervention targets the Human Resources Management Department (HRMD) and the academic leadership of specific colleges, which are responsible for the recruitment, credential verification, onboarding, and performance tracking of both full-time and part-time faculty members.

### Context and Rationale (Situation Analysis)
Currently, the onboarding and profiling of faculty members face several critical gaps:
1. **Scattered Data Management:** Prospective faculty members submit CVs and requirements via disparate channels (emails, physical copies), making tracking highly inefficient.
2. **Compliance Visibility:** Administrators struggle to monitor which faculty members have completed their mandatory onboarding documents (Medical Certificates, Clearances, IDs) or submitted their end-of-term class records.
3. **Data Security & Offboarding:** Historical records of inactive faculty are difficult to archive securely. Accessing sensitive documents often poses security risks without proper Role-Based Access Control (RBAC).

Implementing a centralized Faculty Admission and Profiling System solves these issues by creating a single source of truth, directly contributing to PUP's digitalization thrusts.

### Workplace Development Objectives
1. **Automate Recruitment Workflow:** Transition from manual application processing to a digital portal where applicants submit structured profiles and documents.
2. **Enhance Compliance Tracking:** Provide real-time progress indicators for faculty compliance, enabling admins to instantly identify missing requirements.
3. **Strengthen Data Security:** Implement a robust architecture with role-based access controls, ensuring that sensitive documents can only be viewed or deleted by authorized personnel, and providing a secure "Soft Deactivation" for offboarded faculty.
4. **Strategic Alignment:** Support the PUP Institutional Development Plan (IDP) and the Philippine Development Plan 2023-2028 by fostering bureaucratic efficiency and utilizing digital technologies for improved public service delivery.

---

## Part II. METHODOLOGY

### Data Collection & Framework for Analysis
To properly analyze the operational gaps and design the system, a **SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)** framework was utilized alongside Agile software development methodologies.

- **Strengths:** High volume of highly qualified applicants eager to teach at PUP; dedicated administrative staff.
- **Weaknesses:** Reliance on legacy manual processes; lack of a centralized dashboard for compliance tracking; missing audit trails for document deletions or offboarding.
- **Opportunities:** Availability of modern open-source web frameworks (Laravel, React, Tailwind) to rapidly build a secure, enterprise-grade system; alignment with the government's push for e-governance.
- **Threats:** Data privacy breaches if sensitive documents (IDs, CVs) are mishandled; user resistance to adopting new technical platforms.

By leveraging this analysis, the proposed system is explicitly designed to mitigate the Weaknesses and Threats by enforcing rigorous security protocols (e.g., Password Confirmations for deactivation, secure document streaming) while capitalizing on the Opportunities of modern web architecture.

---

## Part III. INTERVENTION

### A. Outcome
**Increased Administrative Efficiency and 100% Compliance Visibility:** A streamlined, fully digitized faculty recruitment and management process that significantly reduces the time required to process applications, tracks document compliance in real-time, and secures faculty data.

### B. Outputs
1. **Public Application Portal:** A friction-free web interface for prospective faculty to submit their profiles and CVs.
2. **Admin Dashboard:** A secure management panel featuring applicant approval workflows, automated credential generation, and an active/archived faculty directory.
3. **Faculty Dashboard:** A personalized hub for active faculty to upload onboarding requirements, track their compliance percentage, and submit class records.

### C. Objectives (SMART)
1. **Specific:** Deploy the core modules of the Faculty Admission and Profiling System to the target department.
2. **Measurable:** Reduce the time it takes to process a new faculty application and verify compliance by at least 50%.
3. **Achievable:** Utilize the already developed and tested application built during the system discovery phase.
4. **Realistic:** The system requires minimal hardware upgrades as it can be hosted on existing university cloud infrastructure.
5. **Time-bound:** Fully implement and test the system within a 3-month deployment window.

### D. Success Indicators
- **Quantitative:** 100% of newly hired faculty accounts are generated through the system; 0% loss of compliance documents due to secure cloud storage.
- **Qualitative:** Positive feedback from the administrative staff regarding the ease of searching the "Archived Faculty" tab and approving applications via the modern user interface.

### E. Actionable Strategies
1. **System Refinement:** Finalize the user interface (Modern Premium design) and role-based access control policies.
2. **User Acceptance Testing (UAT):** Conduct training sessions and pilot testing with select administrative staff to ensure the workflow aligns perfectly with institutional policies.
3. **Deployment & Data Migration:** Migrate existing active faculty records into the new PostgreSQL database and launch the platform.

### F. Resources
- **Human Resources:** IT Project Lead (Student), Target Department Administrative Staff (for UAT), Server Administrator.
- **Technological Resources:** Web Server hosting, PostgreSQL Database, Laravel/React stack.

### G. GESDI/SDG Responsiveness
- **SDG 8 (Decent Work and Economic Growth):** By achieving higher levels of productivity through technological upgrading and innovation.
- **SDG 16 (Peace, Justice and Strong Institutions):** By developing effective, accountable, and transparent institutions at all levels through secure data management and clear audit trails for faculty records.

---

## Part IV. MONITORING AND EVALUATION

### A. Risks and Mitigation
1. **Risk:** User Resistance to the new digital platform.
   - **Mitigation:** Provide comprehensive user manuals (already drafted) and conduct hands-on training sessions with the administrative staff. Keep the User Interface (UI) intuitive and visually appealing.
2. **Risk:** Data Loss or Server Downtime.
   - **Mitigation:** Implement automated daily backups of the PostgreSQL database and the private local storage where sensitive documents are kept. Utilize scalable cloud infrastructure.
3. **Risk:** Unauthorized Access to Sensitive Documents.
   - **Mitigation:** Enforced strict Role-Based Access Control (RBAC) preventing non-admins from accessing document URLs. Implemented an Admin Password Confirmation prompt before deactivating any account.

### B. Sustainability
To ensure the gains of this RISE project are institutionalized beyond the MSIT 645 course completion:
1. **Comprehensive Documentation:** A detailed User Guide has been created for Public Applicants, Faculty Members, and System Administrators, ensuring smooth onboarding for future staff.
2. **IT Handover:** The complete source code, database schema documentation, and architecture diagrams will be turned over to the University's IT Department for long-term maintenance and future integrations (e.g., tying into the university's central SSO).

### C. Gantt Chart
| Phase | Task Description | Timeline | Responsible |
| :--- | :--- | :--- | :--- |
| **1. Planning** | System Discovery, Architecture Design, SWOT Analysis | Weeks 1-2 | Project Lead |
| **2. Development** | Database Schema, Auth Flow, Admin/Faculty Dashboards | Weeks 3-6 | Project Lead |
| **3. Testing** | UAT, Security Audits (403 testing, password checks) | Weeks 7-8 | Project Lead, Admin Staff |
| **4. Deployment** | Production Launch, Data Migration, Turnover | Weeks 9-10 | Project Lead, IT Dept |

---

## Part V. REFLECTIONS AND LESSONS LEARNED

The development of the Faculty Admission and Profiling System as a core requirement for the MSIT 645 IT Strategic Leadership and Strategic Planning course has been deeply transformative. Throughout this project, the theoretical concepts of strategic management were actively applied to solve a real-world bureaucratic bottleneck. 

I learned that strategic IT leadership is not merely about writing code; it is about aligning technological interventions with the broader institutional vision—in this case, PUP's goal of becoming a National Polytechnic University. By interviewing stakeholders and rigorously mapping the "design tree" of user workflows, I realized the importance of anticipating edge cases (such as secure offboarding and document deletion). Integrating security protocols, such as password-confirmed deactivation and secure file streaming, underscored the critical responsibility of managing sensitive personnel data.

Ultimately, this project reinforced that a successful IT initiative requires a delicate balance of technical excellence (modern frameworks, robust databases) and empathetic leadership (intuitive UI, comprehensive training manuals) to overcome organizational resistance and achieve sustainable service excellence.

---

## References

- Polytechnic University of the Philippines. (2022). *Institutional Development Plan (IDP)*. 
- National Economic and Development Authority. (2023). *Philippine Development Plan 2023-2028*.
- United Nations. (2015). *Sustainable Development Goals*.

---

## Appendices

### Appendix A: RE-ENTRY INITIATIVE FOR SERVICE EXCELLENCE (RISE) MATRIX

| Outcome | Objective/s | Output/s | Success Indicators | Strategies/Activities/Tasks | Resources/Budget | Timeframe | Responsible Person |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Streamlined Faculty Recruitment & Compliance** | Reduce application processing and document verification time by 50% | 1. Public Application Portal<br>2. Admin Management Dashboard<br>3. Faculty Compliance Tracker | 100% of new faculty applications processed digitally without physical paper trails. | 1. Finalize Modern UI design.<br>2. Develop RBAC logic & secure document storage.<br>3. Conduct UAT with Admins. | Existing University IT Infrastructure (Servers, DB), Developer Time | 10 Weeks | MSIT 645 Student (Project Lead) |

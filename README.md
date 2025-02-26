# Fleet Management App Requirements

**Introduction:**  
This document outlines the detailed functional requirements for a Fleet Management Application. The system is designed to manage vehicle inventory, leasing contracts, customer information, and operational workflows. It includes distinct user roles with specific permissions, comprehensive logging for all actions, document management capabilities, and reporting dashboards. Optional features and future considerations are noted where applicable.

## 1. User Roles & Permissions

The application will implement role-based access control with two primary user roles: **Low-Tier User** and **Senior User**. Each role has specific permissions and limits, as described below. All user actions must be recorded in an audit log with timestamps.

- **User Roles Defined:**
    
    - **Low-Tier Users:** General staff members with limited authority.
    - **Senior Users:** Managers or administrators with full system access.
- **Low-Tier User Permissions:**
    
    - Can **view inventory** details (vehicles, status, conditions).
    - Can **add new inventory records** (e.g., add a new car to the system).
    - Can **create leasing contracts** for customers **up to a certain value limit** (e.g., contracts below a predefined monetary threshold).
    - **Contract Approval:** Contracts above the value limit will require approval from a Senior User before becoming active. Low-Tier Users cannot approve high-value contracts.
- **Senior User Permissions:**
    
    - **All Low-Tier permissions** plus additional administrative capabilities.
    - Can **approve or reject leasing contracts** with no value limit (no contract amount restrictions for approval).
    - Can **edit or update** any saved data in the system (inventory details, customer info, contracts, etc.).
    - Can **add new users** to the system and assign them the Low-Tier role (user management functions).
    - Can perform **administrative tasks** like configuring system settings and managing alerts.
- **Audit Logging:**
    
    - **Every action** performed by any user (Low-Tier or Senior) **must be logged**. The log entry should include the timestamp of the action, the user who performed it, and details of the action.
    - The log should record **what data was changed or accessed** (e.g., before-and-after values for edits, identifiers of records created or viewed).
    - Logs are immutable and available for review by Senior Users to audit system usage and changes.

## 2. Inventory Management

This module handles the tracking of all fleet vehicles and their status. The system stores detailed information about each car, including condition, mileage, and maintenance history. It ensures that staff can manage fleet assets effectively and stay on top of required upkeep.

- **Vehicle Records:** Each vehicle in the fleet will have a dedicated inventory record containing:
    
    - **Basic Details:** Make, model, year, VIN (Vehicle Identification Number), license plate, etc.
    - **Current Condition:** A field or status indicator for the car’s condition (e.g., Excellent, Good, Needs Maintenance, etc.).
    - **Mileage Tracking:** The current odometer reading, with updates logged whenever mileage is recorded or updated.
    - **Service History:** A chronological log or list of past maintenance and repairs performed on the vehicle (dates, type of service, notes, service provider).
- **Inventory Updates:**
    
    - Users with permission (Low-Tier and Senior) can **add new vehicles** to inventory or **update existing vehicle information** (e.g., update mileage after an inspection or mark a condition change).
    - Whenever inventory data is added or edited, the **action is logged** with timestamp and user info, preserving the history of changes (tie-in with the Audit Logging feature).
- **Maintenance Scheduling:**
    
    - The system should allow recording of **upcoming maintenance or inspection dates** for each vehicle (next service due, expiration of registration/insurance, etc.).
    - Staff can view which vehicles are due for service in a given time frame.
- **Automated Maintenance Alerts (Optional):**
    
    - _Optional Feature:_ The system can automatically trigger **alerts for due maintenance**. For example, if a car is nearing its next service date or has exceeded a mileage threshold without service, an alert or notification is generated.
    - These alerts would appear in the notification panel (and/or be emailed to responsible staff in a future enhancement) to ensure timely maintenance.
    - The maintenance alert settings (such as the lead time for warnings, mileage intervals, etc.) should be configurable by Senior Users.

## 3. Customer Management

This module manages customer information and leasing contracts, and handles billing activities. Each customer has a profile with contact details, contract info, and a history of interactions. The system also supports invoice generation and payment reminders.

- **Customer Profiles:**
    
    - Store key details for each customer: name, contact information (phone, email, address), driver’s license or ID number, etc.
    - Link customers to their active or past **leasing contracts** and the vehicles they have leased.
    - Each profile should have a **“Customer Log” tab** that displays all actions and changes related to that customer (e.g., contracts created, payments recorded, communications sent). This log is read-only and draws from the global action log, filtered for the specific customer.
- **Leasing Contracts:**
    
    - Low-Tier Users can **create new leasing contract records** for a customer (filling in contract details like vehicle, lease term, start/end dates, agreed payment amount, etc.), subject to their approval limit.
    - If the contract value or conditions exceed Low-Tier limits, the contract is marked as “Pending Senior Approval”. Senior Users can then review and approve or reject such contracts.
    - Contracts include fields for payment schedule, due dates, and any special terms. Once approved (by Senior if needed), the contract becomes active and is tracked by the system.
- **Invoice Generation:**
    
    - The system provides a way to **generate invoices** for leasing payments. Users (typically Senior or accounting staff) will enter billing details such as the amount due, billing period, and any additional fees or taxes.
    - Based on the entered data, the system generates an **invoice document** (which can be printed or saved as PDF) to be sent to the customer. The invoice should reference the contract and customer details automatically.
    - Invoices are logged and linked to the respective customer and contract record for history tracking.
- **Payment Tracking & Reminders:**
    
    - Users can record when a payment is received for an invoice (mark an invoice as paid, with date of payment). The system should update the contract’s payment status accordingly (e.g., outstanding balance, next due date).
    - The system should **send reminders for upcoming payments** to the internal users responsible. For example, as a payment due date approaches, a notification appears for staff to follow up. These reminders ensure users proactively manage collections.
    - _(Optional Future Expansion:)_ Ability to send payment reminders **directly to customers** via email or SMS. This would involve customer-facing notifications, which is a planned feature but not in the initial release. Internal reminders will be implemented first.
- **Customer Communications (Future Consideration):**
    
    - Although not in the initial specifications, the system could later integrate a module for managing communications (emails, calls) with customers. If implemented, these communications would also be logged under the customer’s profile for a complete activity history.

## 4. Logs & Notifications

The application will include a comprehensive logging system and an in-app notification center (admin panel alerts). These ensure transparency of actions and help users stay informed about important events like contract expirations or missed payments.

- **Action Logs (Audit Trail):**
    
    - All critical actions in the system are recorded in a centralized **audit log**. This includes create, read (view), update, delete actions on important entities (vehicles, contracts, customers, invoices, users).
    - Each log entry records the **timestamp**, the **user** who performed the action, and a **description** of the action. For data modifications, the log should capture which fields were changed and their values (before and after, if applicable).
    - Examples of logged events: User A added a new vehicle record (with vehicle ID); User B updated Vehicle #123’s mileage from 20,000 to 25,000; User C approved Contract #456 for Customer X; User D logged in/out.
    - The log can be filtered or searched by date range, user, or record, to facilitate audits and reviews by Senior Users or system administrators.
- **Notifications Center:**
    
    - The system will have an **admin panel notification area** accessible to users (with perhaps a notification icon or dashboard widget).
    - Notifications will be generated for key events and exceptions, including:
        - **Contract Expirations:** Alert when a leasing contract is nearing its end date (e.g., 30 days before expiration, and again at 7 days).
        - **Overdue/Missing Payments:** Alert when a payment is past due or not received by its due date, prompting staff to take action.
        - **Maintenance Due:** (If maintenance alerts feature is enabled) Alert when a vehicle requires service or inspection.
        - **Document Expiry:** Alert if important documents (like insurance or registration in the Document Management module) are about to expire.
    - Notifications should be clearly visible when a user logs into the system and ideally show the count of pending alerts. Users should be able to click a notification to view more details (e.g., go to the relevant contract or vehicle record).
- **Notification Delivery (Optional Enhancement):**
    
    - In the initial version, notifications are **in-app only** (internal). A future enhancement could include emailing critical notifications to relevant staff or sending push notifications if a mobile app is used.
    - The system design should allow for adding these external notification channels later without significant overhaul (modular notification system).

## 5. Document Management

The fleet management app must handle various documents associated with vehicles, contracts, and customers. It should provide secure upload, storage, download, and verification functionalities. Generating standardized documents (like contracts) is also a key feature.

- **Supported Document Types:**
    
    - Vehicle-related documents: **Car registration** papers, **insurance** certificates, maintenance reports.
    - Contract documents: Signed lease **contracts** and any amendments.
    - Customer documents: **Identification cards** or driver’s licenses, proof of address, etc.
    - Other supporting documents as needed (e.g., accident reports, if applicable).
- **Upload & Storage:**
    
    - Users should be able to **upload documents** and attach them to the relevant record in the system (e.g., attach a scanned registration to the vehicle’s profile, or a signed contract PDF to the contract record).
    - The system will store these documents securely, with proper access controls (only authorized users can view/download documents).
    - There should be an interface to **download or view** a document. For example, a Senior User viewing a contract can download the signed contract file.
- **Document Verification Process:**
    
    - The system includes a process to **verify documents**. For example, when a Low-Tier User uploads a new document (like a customer’s ID or a new insurance paper), a Senior User should review it for accuracy and mark it as “Verified” in the system.
    - Unverified documents might be flagged or limited in use (e.g., a contract cannot be fully approved until required documents are verified).
    - The verification status of each document (Pending, Verified, Rejected) should be visible in the document list.
- **Automatic Contract Generation:**
    
    - Upon contract approval (especially for new leases), the system should **generate a contract document** that can be printed or saved. This could be a PDF that includes all the terms of the lease, populated from the system’s data (customer info, vehicle info, lease terms).
    - The contract document should have a standard template format, including places for signatures if it will be printed for signing, or an e-signature process if done digitally.
    - Once generated, this contract document is stored in the system (attached to the contract record) and can be downloaded by authorized users.
    - If any contract terms are edited after initial approval, a new version of the contract document should be generated to reflect the changes, and older versions should be retained or marked as superseded for record-keeping.
- **Document Expiration and Renewal:**
    
    - For documents that expire (e.g., vehicle insurance, registration, driver’s license copies), the system should track their expiration dates.
    - Ideally, it will trigger a **notification** (in the Notifications Center) when a document is close to expiring so that staff can update it. (For example, alert 1 month before a vehicle’s insurance expires so new proof can be uploaded.)

## 6. Reports & Analytics

The application should provide dashboards and reports to give insights into fleet operations. Key performance indicators (KPIs) and data points will be presented in an easy-to-read format. Users should be able to export report data for further analysis or record-keeping.

- **Dashboard Overview:**
    
    - A dashboard accessible to authorized users (probably Senior Users by default, possibly a read-only dashboard for Low-Tier if appropriate) will display real-time KPIs and stats.
    - **Active Cars:** Number of vehicles currently in service/leased out (versus total in fleet). This helps track fleet utilization.
    - **Active Customers:** Number of customers who currently have an active lease contract.
    - **Upcoming Payments:** Count (and possibly a list) of payments due in the near future (e.g., within the next X days) and any that are overdue. This highlights cash flow and collection tasks.
    - **Contracts Nearing End:** Number of active contracts that will expire soon (e.g., within 30 days). This helps staff prepare renewal offers or vehicle returns.
    - **Exchange Rate Tracking:** (If applicable) Display current exchange rates or a trend if the business deals with multiple currencies. For example, if leases are paid in different currencies, showing current USD/EUR rates can be useful. This item may be included if currency fluctuations impact pricing or reporting.
- **Detailed Reports:**
    
    - The system should allow generating **detailed reports** on various datasets, such as:
        - **Fleet Inventory Report:** List of all vehicles with details like mileage, last service date, next service due, current status.
        - **Customer and Contract Report:** Active contracts list with customer name, vehicle, start/end dates, payment status, etc.
        - **Financial Report:** Invoices issued in a time period, payments received, outstanding balances, etc.
        - **Maintenance Report:** Upcoming and completed maintenance tasks for each vehicle, including costs if tracked.
    - Users should be able to set filters for reports (e.g., generate a report of all contracts expiring in the next 60 days, or all vehicles with mileage over 50,000).
- **Exporting & Format:**
    
    - All reports and dashboard data should be **exportable** in common formats for offline analysis or sharing. Supported formats must include: **CSV** (comma-separated values for spreadsheets), **Excel (XLSX)**, and **PDF**.
    - When exporting, the data should reflect the current filters or selections the user has made in the report view.
    - The exported documents should be properly formatted (e.g., CSV with headers, Excel with columns labeled, PDF in a readable table or list format).
- **Analytics & Visualization (Future Consideration):**
    
    - In the future, the dashboard might include more visual charts or graphs (e.g., a line chart of active customers over time, pie chart of vehicle status distribution). Initially, focus is on textual and tabular data, but the design should not preclude adding visual analytics.
    - If integrated, ensure that such features remain optional and do not hinder the performance of the system on older hardware (keeping an eye on hardware requirements if this is a concern).

## 7. Security & Compliance (Additional Considerations)

__(This section covers non-functional but critical requirements related to data security and regulatory compliance, which are important in a system managing customer and vehicle data.)__

- **Data Security:**
    
    - The application must enforce strong **authentication** (unique login for each user, with secure password policies; consider two-factor authentication for Senior Users or all users).
    - **Authorization controls** must ensure users can only access data permitted by their role. (E.g., Low-Tier Users cannot access user management settings reserved for Seniors.)
    - Sensitive personal data (customer info, IDs) and documents should be stored encrypted in the database or storage. Access to these should be logged as well.
    - The system should use HTTPS and secure protocols for data transmission, especially if it’s a web-based or cloud application.
- **Compliance:**
    
    - If applicable, the system should comply with data protection regulations (for example, GDPR if customers are EU citizens, or other local privacy laws). This includes the ability to delete or anonymize customer data upon request and proper consent for storing personal information.
    - Document handling should comply with any legal requirements (such as retaining contract copies for a certain number of years, etc.). The system should not allow unauthorized deletion of critical records (possibly only Senior Users can delete, or deletion is disabled for certain records).
- **Backup & Audit:**
    
    - Regular **data backups** should be considered to prevent data loss (this might be handled by the IT infrastructure rather than the app itself, but the requirement is noted).
    - The **audit log** should be immutable and backed up, as it's crucial for compliance and troubleshooting. There should be a way to export or archive logs periodically.

## 8. Optional Features & Future Roadmap

Throughout the requirements above, several optional features and future improvements have been noted. Here is a summary of those for clarity, which can be slated for future development phases:

- **Automated Maintenance Alerts:** Proactively notify when a vehicle needs service (based on date or mileage). This enhances Inventory Management and can reduce manual tracking. (Marked as optional in Inventory Management section.)
- **Customer Notification System:** Expand the internal reminder system to send emails/SMS to customers for things like upcoming payments or expiring contracts. Useful for improving customer communication, but requires careful implementation (marked as a future expansion in Customer Management section).
- **Advanced Analytics Dashboard:** Adding charts, graphs, and predictive analytics (e.g., forecasting fleet utilization or financials). This can provide more insights but is not required in the initial release.
- **Mobile App Access:** While not described above, a potential future addition is a mobile app or mobile-friendly interface for on-the-go access to key features (like checking inventory or receiving push notifications for alerts).
- **Integration APIs:** In the future, the system might offer APIs to integrate with other software (accounting systems, telematics/vehicle GPS systems for real-time mileage updates, etc.). This can greatly enhance the ecosystem but goes beyond the core requirements defined for now.

## 9. Conclusion

The above requirements detail a comprehensive Fleet Management Application tailored for leasing operations. By implementing clear role distinctions, thorough record-keeping for inventory and customers, robust logging of all activities, and convenient document handling, the system will streamline fleet operations and enforce accountability. Additionally, the reporting tools and optional enhancements ensure the platform can grow and continue to meet the organization’s needs. All stakeholders (from everyday Low-Tier users to Senior managers) will have the tools necessary to perform their tasks efficiently while maintaining data integrity and security.



Next.js Project Folder Structure

/ (Root)
│── pages/
│   ├── index.js                 # Dashboard (Main Admin Panel with Stats)
│   ├── login.js                 # Login Page (Auth handled via API)
│   ├── inventory/
│   │   ├── index.js             # List all vehicles (Fetch from Backend API)
│   │   ├── [id].js              # View single vehicle details
│   ├── customers/
│   │   ├── index.js             # List all customers (Fetch from Backend API)
│   │   ├── [id].js              # View single customer profile
│   ├── contracts/
│   │   ├── index.js             # List all contracts (Fetch from Backend API)
│   │   ├── [id].js              # View single contract details
│   ├── payments/
│   │   ├── index.js             # List all invoices/payments
│   │   ├── [id].js              # View single invoice details
│   ├── reports/
│   │   ├── index.js             # Reports Dashboard
│   │   ├── sales.js             # Sales Reports
│   │   ├── inventory.js         # Inventory Reports
│   │   ├── approvals.js         # Contract Approvals Reports
│   ├── settings/
│   │   ├── index.js             # General Settings
│   │   ├── users.js             # Manage Users (Senior Users Only)
│   ├── notifications.js         # Notification Center
│── components/                   # Reusable Components
│   ├── Sidebar.js               # Sidebar Navigation
│   ├── Header.js                # Header/Nav Bar
│   ├── Table.js                 # Reusable Table Component
│   ├── Modal.js                 # Reusable Modal Component
│   ├── AddCustomerModal.js      # Modal for Adding Customer
│   ├── EditCustomerModal.js     # Modal for Editing Customer
│   ├── AddVehicleModal.js       # Modal for Adding Vehicle
│   ├── EditVehicleModal.js      # Modal for Editing Vehicle
│   ├── AddContractModal.js      # Modal for Adding Contract
│   ├── EditContractModal.js     # Modal for Editing Contract
│── styles/                       # Global and Component Styles
│── public/                       # Static Files (logos, images, etc.)
│── utils/                        # Helper functions (API calls, formatters, etc.)
│   ├── api.js                   # API Request Wrapper
│   ├── auth.js                  # Authentication Helpers (Login, Logout, JWT)
│── context/                      # Context for Global State Management
│   ├── AuthContext.js           # Authentication State Context
│   ├── NotificationContext.js   # Global Notifications
│── middleware/                   # Authentication Middleware (JWT Handling)
│── services/                     # API Services (Separate API Calls)
│   ├── vehicleService.js        # Vehicle API Calls
│   ├── customerService.js       # Customer API Calls
│   ├── contractService.js       # Contract API Calls
│   ├── paymentService.js        # Payment API Calls
│── hooks/                        # Custom Hooks for Fetching Data
│   ├── useCustomers.js          # Fetch customers from API
│   ├── useVehicles.js           # Fetch vehicles from API
│   ├── useContracts.js          # Fetch contracts from API

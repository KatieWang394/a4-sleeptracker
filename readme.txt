--Readme document for Yueshan Wang and Jiaxun Huang, yueshaw@uci.edu and jiaxunh1@uci.edu, 28804007 and 74145897--

Canvas Assignment Group Number: 65

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

9/10 (provisional until the demo video is complete)
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 0/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
Yueshan Wang: 9 hours
Jiaxun: 9 hours


3. What online resources did you consult when completing this assignment? (list specific URLs)

Ionic CLI documentation, ionic generate: https://ionicframework.com/docs/cli/commands/generate — Consulted to understand how to generate pages and components.
ChatGPT: https://chatgpt.com/ — Used to help design UI prototypes, identify color values, analyze and organize the code architecture, troubleshoot potential bugs, and review the implementation against the assignment requirements.

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
We worked together on the app and discussed how the Today, Sleep, and History screens would fit together with logging and local storage.


5. Is there anything special we need to know in order to run your code?

From the repository root, run cd sleeptracker, npm ci, and npm start. Open the localhost URL printed in the terminal and use the browser's mobile viewport mode to preview the layout.



--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

We designed Sleep Notes for college students who want to log last night's sleep in the morning and check in on how sleepy they feel between classes or study sessions.



7. Did you design your app specifically for iOS or Android, or both?

We prioritized iOS, using Ionic's iOS mode and a persistent bottom tab bar with labeled destinations. The app runs in the browser.



8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

In Sleep, enter the date and time for bedtime and wake-up, review the Time in bed preview, and tap Save sleep log. Two date-and-time fields make it possible to record sleep across midnight and check the duration before saving.



9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

On Today, tap a Stanford Sleepiness Scale score from 1 to 7 and save the check-in with the suggested current time or a time you choose. This keeps repeated check-ins short, and Details opens the full scale when a user wants to compare levels.



10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

History shows overnight logs and daytime check-ins together, grouped by date and ordered newest first. The two record types have distinct labels and icons so users can scan their journal and compare entries from the same day.



11. Which feature choose--using a native device resource, backing up logged data, or both?
We chose local data persistence for both overnight sleep and daytime sleepiness records.


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
Not applicable. We chose data persistence for this requirement.


13. If you backed up logged data, where does it back up to?
Ionic Storage saves both record types in the browser's IndexedDB, with localStorage as a fallback. Reloading the app at the same address restores saved entries.


14. How does your app implement or follow principles of good mobile design?

Today shows the latest sleep summary and gives users quick access to both logging flows, while the labeled bottom tabs follow iOS navigation conventions. Users can undo a new save within three seconds from above the tab bar or delete an incorrect past entry in History, while the duration preview, date and time validation, and disabling Save during writes help prevent mistakes.

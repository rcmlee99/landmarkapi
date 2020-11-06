# Landmark Remark

This mobile application is written using SwiftUI + Combine. 

The IOS deployment target is version 13. In bespoke app, I will support at least one earlier version. 
If client requires IOS 12 support, then I cannot use SwiftUI and Combine. 

Apple new Combine Framework is a declarative Swift API for processing values over time. 
Combine allow us to chain events and simplify code for dealing with things like delegates, notifications, timers, completion blocks and callbacks.

The backend is written in NodeJS and deployed to Firebase Functions using Firestore as its NoSQL database.

SwiftUI IOS 13 does not come with a build in MapView, ActivityIndicatorView and TextView.

To use MapKit and UIActivityIndicatorView in SwiftUI, I wrap with the UIViewRepresentable protocol. 
The map opens with default center region at Central Station, Sydney with span latitudeDelta 0.25, longitudeDelta 0.25.
After accepting location request, it will show user location on the map (Backlog Task 1).

The same can be done with UITextView, however for this exercise, I have replaced it with Textfield for now. 
Notes that are save are post to the backend API using Landmark Service written in Combine. Default username is rcmlee99 (Backlog Task 2).
It will be great to add in OAuth Login using Firebase Authentication or AWS Cognito in future.

Using Landmark Service, I can fetch all users from the backend api with query parameter latitude and longitude of center region.
Blue PIN represents me and Red Pin represents other users. (Backlog Task 3 & 4)
You can touch on the Pin to show callout which you can see the User Notes Detail View. 

In the list view, I can fetch all the users from the backend api with the query parameter searchText.

Ideally the backend api will have query searchText and spatial latitude and longitude implementation for efficiency. 
Since this exercise is mobile focus, I return all the users in the firestore. I filter the list of user notes locally when searchText changes (Backlog Task 5)

I have implemented Unit Test for the Model and Response Objects. For View, Apple recommendation for now is to use SwiftUI Preview. Alternatively, I could use Snapshot Testing in future.



# TechAssignment

 - This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.6.
 - Uses Tailwind for CSS goodness.
 - NgRx Store added for efficient state management.
 - Cypress for end to end testing.
 - A working demo of the assignment can be found [here](https://blogposts-tech-assignment.netlify.app/)

## Running the code

 - clone this repository and run `npm i` to install all the dependencies
 - `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
 - `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
 - `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
 - `ng e2e` to execute the e2e tests via [Cypress](https://docs.cypress.io/guides/overview/why-cypress).

 ## Design Choices:

 - Fitting a 10 x 10 grid on smaller devices becomes cumbersome, so I have added a media query which fixes the width of the grid and allows for scrolling, ensuring a smooth UX.
 - On the top right corner, I have added a "reset" button, which will reset any selected post value. It just seems right to have :)
 - Lime color was appropriate for showing a selected post. From there on out, I stuck to the lime color scheme. 


## Questions

##### 1. We use JWTs a lot throughout our API. For instance, when a user logs in on our API, a JWT is issued and our web-application uses this token for every request for authentication. Here's an example of such a token:
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiJzb21lb25lQGV4YW1wbGUubmV0IiwiYWRtaW4iOmZhbHNlLCJ2YWxpZF91bnRpbCI6IldlZCBEZWMgMzEgMjM6NTk6NTkgQ0VTVCAxOTY5In0.4bl2puoaRetNjO1GsweKOnnQsYgwNa9bQIC-WQZkuNo`
##### Why is it (or isn't it) safe to use this?

##### Answer:

 - JWTs (JSON Web Tokens) contain all the information required to authenticate the user which minimises server side sessions.
 - JWTs (JSON Web Tokens) are safe when used properly. That means:
    - storing them securely on the web-application using cookies as opposed to localStorage where they are  exposed. 
    - APIs should be used in HTTPS mode while transferring tokens as opposed to the much more vulnerable HTTP
    - storing secret keys in environment variables or other secret key managing services.
    - Refresh tokens should be issued to client side applications and stale tokens should be revoked regularly.
    - A tokens should not contain any sensitive information such as passwords as it can be decoded if the token is leaked.
    - Token signature should be verified propely before granting access to resources.
 - Regarding the token in the example, when decoded through [this site](https://jwt.io), reveals that the expiry date of the token is `Wed Dec 31 23:59:59 CEST 1969` indicating that it is expired but does not seem to have any sensitive information. Expired tokens leave systems vulnerable to replay attacks and may give revoked users extended access. Such tokens should be handled by using strict expiry checks.



 ##### 2. In our web-application, messages sent from one user to another, can contain HTML, which poses some security risks. Describe two attack vectors bad actors might try to abuse? And how would you mitigate these vectors?

 ##### Answer:
 Attack Vector 1:
 - HTML in messages create a vulnerability for script injections. Bad actors can inject harmful js scripts which get executed when user interacts with them, and then compromise user's account and device. 
 - This can be mitigated by ensuring strong encoding of the content in the messages.
 - Other mitigation strategy could inlcude sanitizing the HTML by removing harmful tags such as `<script>` and `iFrame`

 Attack Vector 2:
 - Images and resources loaded from other websites can be used for tracking user's actions which introduces a privacy concern.
 - User's actions can be tracked and sensitive information can be learnt through these actions via correlation or other mechanisms.
 - Mitigation would be not including external resources and tracking mechanisms.




##### 3. Explain the difference between mutable and immutable objects.
   - What is an example of an immutable object in JavaScript?
   - What are the pros and cons of immutability?
   - How can you achieve immutability in your own code?

##### Answer
 - Primary difference between mutable and immutable objects is that the state of mutable objects can be changed after they are created whereas, the state of immutable objects cannot be changed.
 - Updates to mutable objects are performed in place. eg:
 ```
 let a = [1,2,3,4];
 a.push(5)
 console.log(a) // [1,2,3,4,5]
 ```
 - in the above example when we perform push action, the same array is modified.

 - Updates to immutable objects are performed by replacing with new values. eg:

 ```
 let a = "Hello";
 a + " World";
 console.log(a) // "Hello"
 a = a + " World";
 console.log(a)
 ```
 - in this example `a` remains the same even after we perform + operation. We have to replace it with a new string in order to update its value.


- Primitive data types such as `String`, `Boolean`, `Number` are examples of immutable objects in javascript.


- Pros and cons of immutability:
   - Pros
      - Immutability offers a single source of truth making code predictable and easier to debug.
      - Immutable functions in ES6 such as `.map`, `.filter` etc. remove the need for clunky for loops making code more readable.

   - Cons
      - increased memory usage especially when creating object copies with larger size.
      - can require state management frameworks, which have quite a learning curve and may take longer setup times.


- Immutability can be achieved by using functions like `.map`, `.filter` , `slice` and operators such as `...` (spread) help in mainiting immutability of objects.
- State management frameworks, such as NgRx, which are based on immutabilty: the state is the single source of truth and can only be updated by dispatching actions, (once setup and learnt properly) are a good way of implementing immutability in one's code.


##### If you would have to speed up the loading of a web-application, how would you do that? (no need to actually do it, just describe the steps you would take)

##### Answer
- Steps that I would take for increasing loading speed of a web application:
   - Implementing lazy loading, where modules are loaded only when necessary (when user clicks on the page associated with that module)
   - Using caching mechanisms such as local storage efficiently to load commonly used resources faster on subsequent visits.
   - CDN services such as AWS cloudfront, offer faster loading of delivery of images
   - Using light formats of images (.webp), results in faster load times.
   - Adding placeholder images while loading the actual image in background, lets the user interact with the page reducing the page's TTI (Time To Interactive).
   - Focusing on above the fold content, loading images that are further below on the page can be loaded when the user scrolls the page.
   - Leveraging SSR (server side rendering) which delivers fully renderd HTML to the client, which is faster in comparison to rendering on client side
   - Utilizing tools such as google's pagespeed inights and lighthouse which offer insight into loading times on mobile devices as well, can help one audit the application and even get some tips for faster loading
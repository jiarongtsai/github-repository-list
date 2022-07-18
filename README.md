
# Github Repository List

> [Demo link](http://www.github-repository-list.link/)

Search for GitHub repositories for certain organization.

![website demo file](./public/demo.gif)


## Architecture Design

Start the project with **CRA**, try to use **TypeScript** as the development language, and use **Chakra** as the library of UI components.

Mainly complete the core function with **queryParamsReducer** and **useInfinitySearch**:

### **queryParamsReducer (useReducer)**
    
- Combine keywords, paging, conditions, and currently displayed data into a **state** objects. 
- Use the reducer function to **organize the data processing logic**, improve maintainability and make code easier to read.
    
### **useInfinitySearch (hooks)**
    
- Extract the useEffect with Infinity scroll and data-fetching in a custom hooks.
    
- **Handle UI Stack** and **store data-fetching conditions(and results)** in the hooks, in order to simplify the logic of the main program. 


## Features

### Basic
1. Connect to [List Organization Repository](https://docs.github.com/en/rest/repos/repos#list-organization-repositories) API.
2. Implement infinity Scroll with [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
3. Handle query params with **useReducer**.

### Optional

1. Deploy on [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)  ([Demo link](http://www.github-repository-list.link/)).

2. Prevent re-fetching data by storing in a **useState**.

3. Handle UI Stack(Error, Empty, and Loading) with **custom hooks**.

### Feature Improvement
1. Split the data-fetching function into reusable hooks.
2. Re-thinking the method to implement infinity scroll. (Easy to re-fetching with the same condition currently.)

## Install


Clone the project

```properties
git clone https://github.com/jiarongtsai/github-repository-list.git
```

Go to the project directory

```properties
cd github-repository-link
```

Download dependencies

```properties
yarn install  
```

Run the app

```properties
yarn start  
```

Go to [http://localhost:3000](http://localhost:3000) to view the project in the browser.

<br/>

<hr/>

Created by **Bella** [@jiarongtsai](https://github.com/jiarongtsai)  
[jiarongtsai19@gmail.com](mailto:jiarongtsai19@gmail.com) | [Linkedin](https://www.linkedin.com/in/jia-rong-tsai/) |
[Facebook](https://www.facebook.com/jiarongtsaiBella/)

<br/>



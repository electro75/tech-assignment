export interface Post {
    userId: number,
    id: number,
    title: string,
    body: string,
    [x: string]: unknown // done to accept any other keys if the case arises 
}
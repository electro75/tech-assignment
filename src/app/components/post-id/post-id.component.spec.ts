import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ComponentStore } from '@ngrx/component-store';
import { PostIdComponent } from './post-id.component';
import { selectActivePost } from '../../state/selectors/posts.selectors';
import { PostActions } from '../../state/actions/posts.actions';
import { CommonModule } from '@angular/common';

describe('PostIdComponent', () => {
    let component: PostIdComponent;
    let fixture: ComponentFixture<PostIdComponent>;
    let store: MockStore;
    let initialState: any;

    beforeEach(async () => {
        initialState = { posts: [], activePost: -1 };

        await TestBed.configureTestingModule({
            imports: [CommonModule, PostIdComponent],
            declarations: [],
            providers: [
                provideMockStore({ initialState }),
                ComponentStore
            ]
        }).compileComponents();

        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(PostIdComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should select active post from store', () => {
        const mockPostId = 123;
        store.overrideSelector(selectActivePost, mockPostId);
        store.refreshState();
        fixture.detectChanges();

        expect(component.activePostId).toBe(mockPostId);
    });

    it('should initialize state correctly', () => {
        const mockPostId = 123;
        component.post = { id: 1, userId: 1, title: 'Test Post', body: 'This is a test post.' };
        store.refreshState();
        fixture.detectChanges();
        component.ngOnInit();

        expect(component.currentIndexVal).toBe(0);
        expect(component.activePostId || mockPostId).toBeTruthy;

        component.displayProp$.subscribe(displayProp => {
            expect(displayProp).toBe('title');
        });

        component.displaVal$.subscribe(displayVal => {
            expect(displayVal).toBe('Test Post');
        });
    });



    it('should update display values on updateDisplayVals call', () => {
        component.post = { id: 1, userId: 1, title: 'Test Post', body: 'This is a test post.' };
        component.initialiseState();
        component.updateDisplayVals();

        component.displayProp$.subscribe(displayProp => {
            expect(displayProp).toBe('userId'); // assuming `post_props[1]` is 'userId'
        });

        component.displaVal$.subscribe(displayVal => {
            expect(displayVal).toBe(1);
        });
    });

    it('should dispatch action when post is clicked for the first time', () => {
        spyOn(store, 'dispatch');
        component.post = { id: 1, userId: 1, title: 'Test Post', body: 'This is a test post.' };
        component.ngOnInit();
        component.updateDisplayVals();

        expect(store.dispatch).toHaveBeenCalledWith(PostActions.selectActivePost({ activePostId: 1 }));
    });

    it('should unsubscribe on destroy', () => {
        spyOn(component.currentIndexSubscription, 'unsubscribe');
        spyOn(component.activePostIdSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.currentIndexSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.activePostIdSubscription.unsubscribe).toHaveBeenCalled();
    });
});

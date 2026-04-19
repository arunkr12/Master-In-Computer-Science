% --- 1. THE FACTS ---
parent(john, mary).
parent(john, bob).
parent(mary, alice).
parent(bob, charlie).
parent(alice, eva).

male(john).
male(bob).
male(charlie).
female(mary).
female(alice).
female(eva).

% --- 2. THE RULES ---
% Rule: Grandparent
grandparent(GP, GC) :- 
    parent(GP, Parent), 
    parent(Parent, GC).

% Rule: Sibling (X and Y share a parent P, and X is not Y)
sibling(X, Y) :- 
    parent(P, X), 
    parent(P, Y), 
    X \= Y.

% Rule: Cousin (Parents are siblings)
cousin(X, Y) :- 
    parent(P1, X), 
    parent(P2, Y), 
    sibling(P1, P2).

% Rule: Descendant (Recursive)
descendant(Child, Ancestor) :- 
    parent(Ancestor, Child).
descendant(Child, Ancestor) :- 
    parent(Ancestor, Intermediate), 
    descendant(Child, Intermediate).

% --- 3. THE MAIN QUERY BLOCK ---
:- initialization(main).

main :-
    write('--- Family Tree Results ---'), nl,
    
    % Query 1: Grandparents
    write('Grandparents of Alice: '),
    (grandparent(G, alice) -> write(G); write('None')), nl,

    % Query 2: Siblings
    write('Siblings of Mary: '),
    (sibling(mary, S) -> write(S); write('None')), nl,

    % Query 3: Cousins
    write('Cousins of Alice: '),
    (cousin(alice, C) -> write(C); write('None')), nl,

    % Query 4: Descendants
    write('Descendants of John: '),
    findall(D, descendant(D, john), List),
    write(List), nl,

    halt. % Required to stop the process cleanly.

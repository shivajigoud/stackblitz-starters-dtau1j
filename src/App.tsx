import { FC, useEffect, useRef, useState } from 'react';
import { act } from 'react-dom/test-utils';

import './style.css';

export const App: FC<{ name: string }> = ({ name }) => {
  const [todos, setTodos] = useState([]);
  const [todosPerPage, setTodosPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastTodo = currentPage + todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const visibleTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
  const numberOfTotalPages = Math.ceil(todos.length / todosPerPage);
  const pages = [...Array(numberOfTotalPages + 1).keys()].slice(1);
  const pageControllerRef = useRef();
  const pageWrapperRef = useRef();
  function prevPage(): any {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      pageWrapperRef?.current?.querySelectorAll('button')[currentPage]?.focus();
      pageWrapperRef.current.scrollLeft =
        pageWrapperRef.current.scrollLeft - document.activeElement.offsetWidth;
    }
  }
  function nextPage(): any {
    if (currentPage !== numberOfTotalPages) {
      setCurrentPage(currentPage + 1);
      pageWrapperRef?.current?.querySelectorAll('button')[currentPage]?.focus();
    }
  }
  // function pageFocus(): any {
  //   console.log(
  //     document.activeElement.offsetLeft,
  //     // pageWrapperRef.current.scrollLeft
  //     pageControllerRef?.current?.getBoundingClientRect().left
  //     // pageControllerRef?.current?.getBoundingClientRect().width
  //   );
  //   // if(document.activeElement.offsetLeft > pageWrapperRef.current.scrollLeft)
  //   // pageWrapperRef.current.scrollLeft = pageWrapperRef.current.scrollLeft - 70;
  // }
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/')
      .then((res) => res.json())
      .then((todos) => setTodos(todos));
  }, []);
  return (
    <div>
      <div className="pagination">
        <button onClick={() => prevPage()}>Prev</button>
        <div className="pagination-wrapper" ref={pageWrapperRef}>
          <div className="pagination-controller" ref={pageControllerRef}>
            {pages?.map((page, index) => {
              return (
                <div className="filter-buttons-wrapper">
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    // onFocus={pageFocus}
                    className={`${currentPage == page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                  <ul
                    className={`filter_drop_down ${
                      currentPage == page ? 'show' : 'hide'
                    }`}
                  >
                    {visibleTodos?.map((todo) => {
                      return (
                        <li key={todo.id}>
                          <input type="checkbox" id={todo.id} />
                          <label htmlFor={todo.id}>{todo.value}</label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={() => nextPage()}>Next</button>
      </div>
    </div>
  );
};

import { FC, useEffect, useRef, useState } from 'react';
import { act } from 'react-dom/test-utils';

import './style.css';

export const App: FC<{ name: string }> = ({ name }) => {
  const [todos, setTodos] = useState([]);
  const [todosPerPage, setTodosPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLFTButton, setShowLFTButton] = useState(false);
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
      if (document.activeElement.offsetLeft > pageWrapperRef.current.scrollLeft)
        pageWrapperRef.current.scrollLeft =
          pageWrapperRef.current.scrollLeft -
          document.activeElement.offsetWidth;
    }
  }
  function nextPage(): any {
    if (currentPage !== numberOfTotalPages) {
      setCurrentPage(currentPage + 1);
      pageWrapperRef?.current?.querySelectorAll('button')[currentPage]?.focus();
    }
  }
  function controlButtonsVisibility() {
    let filterButtons = Array.prototype.slice.apply(
      pageControllerRef?.current?.querySelectorAll('button')
    );
    let filterButtonsWidth = filterButtons.reduce((w, btn) => {
      return (
        w +
        btn.offsetWidth +
        parseInt(
          window.getComputedStyle(btn).getPropertyValue('margin-right')
        ) +
        parseInt(window.getComputedStyle(btn).getPropertyValue('margin-left'))
      );
    }, 0);
    console.log(filterButtonsWidth);
    if (pageControllerRef?.current?.offsetWidth < filterButtonsWidth) {
      setShowLFTButton(true);
    } else setShowLFTButton(false);
  }
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/')
      .then((res) => res.json())
      .then((todos) => {
        setTodos(todos);
        controlButtonsVisibility();
      });
    window.addEventListener('resize', controlButtonsVisibility);
    return () => {
      window.removeEventListener('resize', controlButtonsVisibility);
    };
  }, []);
  return (
    <div>
      <ul>
        {visibleTodos?.map((todo) => {
          return <li key={todo.id}>{todo.title}</li>;
        })}
      </ul>
      <div className="pagination">
        <button
          onClick={() => prevPage()}
          className={`${showLFTButton ? 'show' : 'hide'}`}
        >
          Prev
        </button>
        <div className="pagination-wrapper" ref={pageWrapperRef}>
          <div className="pagination-controller" ref={pageControllerRef}>
            {pages?.map((page, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setCurrentPage(page)}
                  // onFocus={pageFocus}
                  className={`${currentPage == page ? 'active' : ''}`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => nextPage()}
          className={`${showLFTButton ? 'show' : 'hide'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

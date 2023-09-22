import { FC, use, useEffect, useRef, useState } from 'react';
import { act } from 'react-dom/test-utils';

import './style.css';

export const App: FC<{ name: string }> = ({ name }) => {
  const [todos, setTodos] = useState([]);
  const [todosPerPage, setTodosPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastTodo = currentPage + todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const visibleTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
  const numberOfTotalPages = Math.ceil(todos.length / todosPerPage);
  const pages = [...Array(numberOfTotalPages + 1).keys()].slice(1);
  const pageWrapperRef = useRef();
  const [showDropDown, setShowDropDown] = useState(true);
  const [showLFTButton, setShowLFTButton] = useState(false);
  const [dropdownLeftPosition, setDropdownLeftPosition] = useState('0px');

  function prevPage(): any {
    let pwsLeft = pageWrapperRef.current.scrollLeft;
    let pwsWidth = pageWrapperRef.current.scrollWidth;
    let pwcWidth = pageWrapperRef.current.clientWidth;
    pageWrapperRef.current.scrollTo(pwsLeft - pwcWidth, 0);
    setShowDropDown(false);
  }
  function nextPage(): any {
    let pwsLeft = pageWrapperRef.current.scrollLeft;
    let pwsWidth = pageWrapperRef.current.scrollWidth;
    let pwcWidth = pageWrapperRef.current.clientWidth;
    pageWrapperRef.current.scrollTo(pwsLeft + pwcWidth, 0);
    setShowDropDown(false);
  }
  function setPositions() {
    setDropdownLeftPosition(
      document.activeElement.getBoundingClientRect().left
    );
    let pwcw = pageWrapperRef?.current?.clientWidth;
    let pwsw = pageWrapperRef?.current?.scrollWidth;
    if (pwcw < pwsw) {
      setShowLFTButton(true);
    } else setShowLFTButton(false);
  }

  useEffect(() => {
    (async function () {
      const data = await fetch('https://jsonplaceholder.typicode.com/todos/');
      const todos = await data.json();
      setTodos(todos);
      setCurrentPage(1);
      setPositions();
    })();

    window.addEventListener('resize', setPositions);
    return () => {
      window.removeEventListener('resize', setPositions);
    };
  }, []);
  useEffect(() => {
    setPositions();
  }, [currentPage]);
  return (
    <div>
      <div className="pagination">
        <button
          onClick={() => prevPage()}
          className={`${showLFTButton ? 'show' : 'hide'}`}
        >
          Prev
        </button>
        <div className="pagination-wrapper" ref={pageWrapperRef}>
          <div className="pagination-controller">
            {pages?.map((page, index) => {
              return (
                <div className="filter-buttons-wrapper">
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentPage(page);
                      setDropdownLeftPosition(
                        document.activeElement.getBoundingClientRect().left
                      );
                      setShowDropDown(true);
                    }}
                    className={`${currentPage == page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                  <ul
                    className={`filter_drop_down ${
                      currentPage == page && showDropDown ? 'show' : 'hide'
                    } `}
                    style={{ left: dropdownLeftPosition }}
                  >
                    <a onClick={() => setShowDropDown(false)}>X</a>
                    {visibleTodos?.map((todo) => {
                      return (
                        <li key={todo.id}>
                          <input type="checkbox" id={todo.id} />
                          <label htmlFor={todo.id}>{todo.title}</label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
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

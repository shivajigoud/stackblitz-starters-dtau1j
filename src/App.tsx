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
  const pageControllerRef = useRef();
  const pageWrapperRef = useRef();
  const [showDropDown, setShowDropDown] = useState(true);
  const [showLFTButton, setShowLFTButton] = useState(false);
  const [dropdownLeftPosition, setDropdownLeftPosition] = useState('0px');
  const [moveableArry, setMovableArry] = useState([]);

  function prevPage(): any {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
    let pwsLeft = pageWrapperRef.current.scrollLeft;
    let pwsWidth = pageWrapperRef.current.scrollWidth;
    let pwcWidth = pageWrapperRef.current.clientWidth;
    pageWrapperRef.current.scrollTo(pwsLeft - pwcWidth, 0);
    pageWrapperRef?.current?.querySelectorAll('button')[currentPage]?.focus();
    setShowDropDown(false);
  }
  function nextPage(): any {
    if (currentPage !== numberOfTotalPages) {
      setCurrentPage(currentPage + 1);
    }
    let pwsLeft = pageWrapperRef.current.scrollLeft;
    let pwsWidth = pageWrapperRef.current.scrollWidth;
    let pwcWidth = pageWrapperRef.current.clientWidth;
    pageWrapperRef.current.scrollTo(pwsLeft + pwcWidth, 0);
    // pageWrapperRef?.current?.querySelectorAll('button')[currentPage]?.focus();

    setShowDropDown(false);
  }
  function setPositions() {
    setDropdownLeftPosition(
      document.activeElement.getBoundingClientRect().left
    );
    let pw = pageWrapperRef?.current?.clientWidth;
    let pcw = pageControllerRef?.current?.offsetWidth;
    if (pw < pcw) {
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
          <div className="pagination-controller" ref={pageControllerRef}>
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

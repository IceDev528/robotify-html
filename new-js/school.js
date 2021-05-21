"use strict";

var initPreventBehavior = function initPreventBehavior() {
	var link = document.querySelectorAll("a");
	link.forEach(function (val, idx) {
		val.addEventListener("click", function (e) {
			if (val.getAttribute("href") === "#") {
				e.preventDefault();
			}
		});
	});
};

var searchFilter = function searchFilter() {
	var getCellValue = function getCellValue(tr, idx) {
		return $($(tr).find('li').children()[idx]).find('p').text().trim('').toLowerCase();
	};
	
	var comparer = function comparer(idx, asc) {
		return function (a, b) {
			return (function (v1, v2) {
				return v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2)
					? v1 - v2
					: v1.toString().localeCompare(v2);
			})(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
		};
	};
	
	var filterArr = [],
		cellIDX = [];
	
	$('[search-filter-js]').on("input", function (ev) {
		var _el = $(ev.currentTarget),
			_elVal = _el.val().toLowerCase(),
			_searchItems = '';
		
		if($('.school__list-link').hasClass('is-filter')) {
			_searchItems = $('.school__list-link.is-filter');
		} else {
			_searchItems = $('.school__list-link')
		}
		
		for (let i = 0; i < _searchItems.length; i++) {
			let txtValue = $(_searchItems[i]).find('p').text().toLowerCase();
			
			if (txtValue.indexOf(_elVal) > -1) {
				$(_searchItems[i]).show();
			} else {
				$(_searchItems[i]).hide();
			}
		}
	});
	
	if($('#filberBySchool').length > 0) {
		
		$('#filberBySchool').fastselect({
			placeholder: 'Filter by...',
			onItemSelect: function($item, itemModel) {
				const groupName = $($item).closest('.fstGroup').find('.fstGroupTitle').text().toLowerCase();
				
				for(let i = 0; i < $('.school__list-header > tr td p').length; i++) {
					const el = $('.school__list-header > tr td p')[i],
						elVal = $(el).text().toLowerCase();
					
					if(elVal.indexOf(groupName) > -1) {
						cellIDX.push($('.school__list-header > tr td').index($(el).parent()));
					}
				}
				
				filterArr.push(itemModel.value.toLowerCase());
				
				for(let i = 0; i < filterArr.length; i++) {
					for(let j = 0; j < $('.school__list-link').length; j++) {
						const cell = $('.school__list-link')[j], cellGroupNode = $(cell).find('td').eq(cellIDX[i]);
						if(filterArr[i].indexOf(cellGroupNode.find('p').text().toLowerCase()) === -1) {
							console.log("-1");
							$(cell).closest('.school__list-link').hide().removeClass('is-filter');
						} else {
							console.log("1");
							$(cell).closest('.school__list-link').addClass('is-filter');
						}
					}
				}
				
				$('body').click();
			}
		});
		
		$(document).on('click', '.fstChoiceRemove', function(ev) {
			let el = $(ev.currentTarget),
				val = el.parent()[0].dataset.value.toLowerCase(),
				elPOSITION = '';
			
			if(filterArr.length < 2) {
				filterArr = [];
				cellIDX = [];
				
				$('.school__list-link').show().removeClass('is-filter');
				
				return false
			} else {
				
				filterArr = filterArr.filter(function(elem, idx) {
					if(elem === val) elPOSITION = idx;
					
					return elem !== val;
				});
				cellIDX = cellIDX.filter(function(elem, idx) {
					return idx !== elPOSITION
				});
				
				for(let i = 0, k = i; i < filterArr.length; i++) {
					for(let j = 0; j < $('.school__list-link').length; j++) {
						const cell = $('.school__list-link')[j],
							cellGroupNode = $(cell).find('td').eq(cellIDX[i]),
							cellGroupNodeNext = $(cell).find('td').eq(cellIDX[k + 1]);
						
						if(filterArr[k + 1] !== undefined) {
							if(cellGroupNode.find('p').text().toLowerCase() !== cellGroupNodeNext.find('p').text().toLowerCase()) {
								if(filterArr[i].indexOf(cellGroupNode.find('p').text().toLowerCase()) > -1 && filterArr[k + 1].indexOf(cellGroupNodeNext.find('p').text().toLowerCase()) > -1) {
									$(cell).closest('.school__list-link').show().addClass('is-filter');
								} else {
									$(cell).closest('.school__list-link').removeClass('is-filter');
								}
							}
						} else {
							if(filterArr[i].indexOf(cellGroupNode.find('p').text().toLowerCase()) > -1) {
								$(cell).closest('.school__list-link').show().addClass('is-filter');
							}else {
								$(cell).closest('.school__list-link').removeClass('is-filter');
							}
						}
					}
				}
				
			}
		});
		
		document.querySelectorAll(".school__list-header > div").forEach(function (th) {
			return th.addEventListener("click", function (ev) {
				const table = th.closest('#school'),
					currentIDX = Array.prototype.slice.call($(ev.currentTarget).closest(".school__list-header").children()).indexOf($(ev.currentTarget)[0]);
				
				var tableBody = {},
					tableBodyTr = {},
					direction = window.asc;
				
				if($(ev.currentTarget).hasClass('is-sort')) {
				
				} else {
					$(".school__list-header > div").removeClass('is-sort is-up is-down');
				}
				
				if($(ev.currentTarget).hasClass('is-down')) {
					$(ev.currentTarget).removeClass('is-down').addClass('is-up');
				} else {
					$(ev.currentTarget).removeClass('is-up').addClass('is-down');
					direction = !window.asc;
				}
				$(ev.currentTarget).addClass('is-sort');
				
				$('.school_row li div').removeClass('is-sort');
				for(var i = 0; i < $('.school_row li div').length; i++) {
					$($($('.school_row li')[i]).find('div')[currentIDX]).addClass('is-sort');
				}
				
				tableBody = table.querySelector('.school__list-wrapper');
				tableBodyTr = table.querySelectorAll('.school_row');
				
				Array
					.from(tableBodyTr)
					.sort(
						comparer(
							currentIDX,
							direction
							// (window.asc = !window.asc)
						)
					)
					.forEach(function (tr) { return tableBody.appendChild(tr); });
			});
		});
	}
	
	
	$('[search-classes-js]').on("input", function (ev) {
		var _el = $(ev.currentTarget),
			_elVal = _el.val().toLowerCase(),
			_searchItems = $('[school-classes-js]');
		
		for (var i = 0; i < _searchItems.length; i++) {
			var txtValue = $(_searchItems[i]).find('h4').text().toLowerCase();
			
			if (txtValue.toLowerCase().indexOf(_elVal) > -1) {
				$(_searchItems[i]).show();
			} else {
				$(_searchItems[i]).hide();
			}
		}
		
		if($('.school__list a').length === $('.school__list a:hidden').length) {
			$('.school__list-empty').fadeIn(300);
		} else {
			$('.school__list-empty').fadeOut(300);
		}
	});
};

var schoolTabs = function schoolTabs() {
	$('[school-tab-js]').on('click', function(ev) {
		var el = $(ev.currentTarget),
			elID = el.attr('data-id');
		
		$('[school-tab-js]').removeClass('is-active');
		el.addClass('is-active');
		
		$('.school__content-wrapper').removeClass('is-open').hide();
		$('.school__content-wrapper[data-content="' + elID + '"]').fadeIn(300);
	});
};

var schoolDropdown = function schoolDropdown() {
	$('body').on('click', function (e) {
		const className = ".school__dropdown-wrapper";
		
		if (!$(e.target).closest(className).length) {
			$('.school__dropdown-wrapper').removeClass('is-open');
		}
	});
	
	$('.school__dropdown-toggle').on('click', function(ev) {
		if($(ev.currentTarget).closest('.school__dropdown-wrapper').hasClass('is-open')) {
			$(ev.currentTarget).closest('.school__dropdown-wrapper').removeClass('is-open');
		} else {
			$('.school__dropdown-wrapper').removeClass('is-open');
			$(ev.currentTarget).closest('.school__dropdown-wrapper').addClass('is-open');
		}
	});
	
	$('.school__dropdown-toggle u').on('click', function(ev) {
		ev.preventDefault();
		$('.school__dropdown-toggle span').text($('.school__dropdown-toggle span').attr('data-name'));
		$('.school__dropdown-wrapper').removeClass('is-append');
		
		return false;
	});
	
	$('.school__dropdown > a').on('click', function(ev) {
		$(ev.currentTarget).closest('.school__dropdown-wrapper').find('.school__dropdown-toggle span').text($(ev.currentTarget).text());
		$('.school__dropdown-wrapper').removeClass('is-open').addClass('is-append');
	});
};

var createNewSchool = function createNewSchool() {
	if($('[popup-js]').length > 0) {
		$('[popup-js]').magnificPopup({
			type: 'inline',
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'is-show',
			callbacks: {
				beforeOpen: function() {
					this.st.mainClass = this.st.el.attr('data-effect');
				},
				close: function() {
					fastSelectCB();
				}
			}
		});
		
		// $('a[href="#createNewSchool"]').trigger('click');
	}
};

var fastSelectCB = function fastSelectCB() {
	if($('.singleFastSelect').length > 0) {
		$('.singleFastSelect').fastselect();
	}
};

var fileUpload = function fileUpload() {
    try{
        $('.my-pond').filepond();
    }
    catch(err){
        console.log(err)
    }
};

var schoolManuallyAddTeacher = function schoolManuallyAddTeacher() {
	$('[manually-add-teacher-js]').on('click', function() {
		var tmpl = `
		<div class="school__form-group-wrapper">
            <div class="school__form-group school__form-group--4">
              <div>
                <div class="school__form-field">
                  <span class="school__form-label">First Name (Optional)</span>
                  <label>
                    <input required placeholder="" name="first_name" type="text">
                  </label>
                </div>
              </div>
              <div>
                <div class="school__form-field">
                  <span class="school__form-label">Last Name (Optional)</span>
                  <label>
                    <input required placeholder="" name="last_name" type="text">
                  </label>
                </div>
              </div>
              <div>
                <div class="school__form-field">
                  <span class="school__form-label">Username</span>
                  <label>
                    <input required placeholder="" name="username" type="text" style="text-transform: lowercase;">
                  </label>
                </div>
              </div>
              <div>
                <div class="school__form-field">
                  <span class="school__form-label">Password</span>
                  <label>
                    <input required minlength="8" placeholder="" name="password" type="text" onfocus="this.type='password'">
                  </label>
                </div>
              </div>
              <button type="button" manually-remove-teacher-js>
                <i class="icon-font icon-remove"></i>
              </button>
            </div>
            <div class="school__content-line"></div>
          </div>
		`;
		
		$('#addTeacherManually').append(tmpl);
	});
	
	$(document).on('click', '[manually-remove-teacher-js]', function(ev) {
		$(ev.currentTarget).closest('.school__form-group-wrapper').remove();
	});
};

function returnDuplicates(array){
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
    return [...new Set(findDuplicates(array))]
}

function parseErrorAndDisplay(errorJson){
    try{var message  = errorJson['message']}
    catch(err){message = ''}
    try{var errorReason = errorJson['error']}
    catch(err){errorReason = ''}

    if (errorReason.indexOf('duplicate key value') > -1) {
      let startIndex = errorReason.indexOf('=(') + 2;
      let username = errorReason.slice(startIndex, errorReason.indexOf(')', startIndex));
      return username;
    }
}


window.onload = function() {
	initPreventBehavior();
	searchFilter();
	schoolTabs();
	schoolDropdown();
	createNewSchool();
	fastSelectCB();
	fileUpload();
	schoolManuallyAddTeacher();
};

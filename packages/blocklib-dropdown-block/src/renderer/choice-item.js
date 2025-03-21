/**
 * QuillForms Dependencies
 */
import { useTheme } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import tinyColor from 'tinycolor2';
import { css } from '@emotion/css';
import { useRef } from '@wordpress/element';

let selectionTimer;

const ChoiceItem = ( {
	choice,
	blockId,
	choiceIndex,
	val,
	clickHandler,
	showDropdown,
	clicked,
	hovered,
} ) => {
	const [ isBeingSelected, setIsBeingSelected ] = useState( false );
	const item = useRef();

	useEffect( () => {
		if ( ! showDropdown ) setIsBeingSelected( false );
	}, [ showDropdown ] );
	const theme = useTheme();
	const answersColor = tinyColor( theme.answersColor );
	const isSelected = val && val === choice.value;
	useEffect( () => {
		if ( clicked ) item.current.click();
		return () => {
			clicked = false;
		};
	}, [ clicked ] );
	return (
		<div
			ref={ item }
			id={ `block-${ blockId }-option-${ choiceIndex }` }
			className={ classnames(
				'dropdown__choiceWrapper',
				{
					selected: isSelected,
					isBeingSelected,
				},
				css`
					background: ${
						hovered
							? answersColor.setAlpha( 0.2 ).toString()
							: answersColor.setAlpha( 0.1 ).toString()
					};

					border-color: ${ theme.answersColor };
					color: ${ theme.answersColor };

					&:hover {
						background: ${ answersColor.setAlpha( 0.2 ).toString() };
					}

					&.selected {
						background: ${ tinyColor( theme.answersColor ).setAlpha( 0.75 ).toString() };
						color: ${ tinyColor( theme.answersColor ).isDark() ? '#fff' : '#333' }
				`
			) }
			role="presentation"
			onClick={ () => {
				if ( isSelected ) {
					clearTimeout( selectionTimer );
				}
				if ( ! isSelected ) setIsBeingSelected( true );
				clickHandler();
				selectionTimer = setTimeout( () => {
					if ( isBeingSelected ) setIsBeingSelected( false );
				}, 400 );
			} }
		>
			{ choice.label }
		</div>
	);
};

export default ChoiceItem;

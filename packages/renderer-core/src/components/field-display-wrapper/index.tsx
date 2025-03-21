/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import { css } from '@emotion/css';
/**
 * Internal Dependencies
 */
import { __experimentalUseFieldRenderContext } from '../field-render';
import useBlockTypes from '../../hooks/use-block-types';
import BlockFooter from '../field-footer';
import useFormContext from '../../hooks/use-form-context';
import useHandleFocus from '../../hooks/use-handle-focus';
interface Props {
	setIsShaking: ( value: boolean ) => void;
	isShaking: boolean;
}
let timer1: ReturnType< typeof setTimeout >,
	timer2: ReturnType< typeof setTimeout >;

const FieldDisplayWrapper: React.FC< Props > = ( {
	isShaking,
	setIsShaking,
} ) => {
	const inputRef = useRef( null );
	const {
		id,
		next,
		blockName,
		isActive,
		attributes,
		showNextBtn,
		showErrMsg,
	} = __experimentalUseFieldRenderContext();

	const isTouchScreen =
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0;

	useHandleFocus( inputRef, isActive, isTouchScreen );
	const { isPreview, formId } = useFormContext();

	if ( ! blockName || ! id ) return null;
	const blockTypes = useBlockTypes();
	const blockType = blockTypes[ blockName ];
	const [ shakingErr, setShakingErr ] = useState( null );

	const { isCurrentBlockEditable, isReviewing } = useSelect( ( select ) => {
		return {
			isCurrentBlockEditable: select(
				'quillForms/blocks'
			).hasBlockSupport( blockName, 'editable' ),
			isReviewing: select( 'quillForms/renderer-core' ).isReviewing(),
		};
	} );
	const { answerValue, isValid } = useSelect( ( select ) => {
		return {
			answerValue: isCurrentBlockEditable
				? select( 'quillForms/renderer-core' ).getFieldAnswerVal( id )
				: null,
			isValid: isCurrentBlockEditable
				? select( 'quillForms/renderer-core' ).isValidField( id )
				: null,
		};
	} );

	const clearTimers = () => {
		clearTimeout( timer1 );
		clearTimeout( timer2 );
	};

	useEffect( () => {
		clearTimers();
		setIsShaking( false );
		if ( shakingErr ) setShakingErr( null );
	}, [ answerValue ] );

	useEffect( () => {
		if ( ! isActive ) {
			clearTimers();
			setIsShaking( false );
			if ( shakingErr ) setShakingErr( null );
		}

		if ( isActive ) {
			setFooterDisplay( true );
		}
	}, [ isActive ] );

	const shakeWithError = ( err ) => {
		clearTimers();
		if ( ! isShaking ) setIsShaking( true );
		if ( ! shakingErr ) setShakingErr( err );
		timer1 = setTimeout( () => {
			setIsShaking( false );
		}, 600 );
		timer2 = setTimeout( () => {
			setShakingErr( null );
		}, 1200 );
	};

	const {
		setIsFieldValid,
		setFieldValidationErr,
		setIsFieldAnswered,
		setIsFieldPending,
		setFieldPendingMsg,
		setFieldAnswer,
		setFooterDisplay,
	} = useDispatch( 'quillForms/renderer-core' );

	const props = {
		id,
		next,
		attributes,
		isValid,
		val: answerValue,
		setIsValid: ( val: boolean ) => setIsFieldValid( id, val ),
		setIsAnswered: ( val: boolean ) => setIsFieldAnswered( id, val ),
		setIsPending: ( val: boolean ) => setIsFieldPending( id, val ),
		setPendingMsg: ( val: string ) => setFieldPendingMsg( id, val ),
		setValidationErr: ( val: string ) => setFieldValidationErr( id, val ),
		setVal: ( val: string ) => setFieldAnswer( id, val ),
		showNextBtn,
		blockWithError: ( err: string ) => shakeWithError( err ),
		showErrMsg,
		isPreview,
		isTouchScreen,
		inputRef,
		setFooterDisplay,
		formId,
	};

	return (
		<div
			role="presentation"
			className="renderer-core-field-display-wrapper"
		>
			{ blockType?.display && (
				<div
					className={ css`
						margin-top: 15px;
					` }
				>
					<blockType.display { ...props } />{ ' ' }
				</div>
			) }
			<BlockFooter shakingErr={ shakingErr } />
		</div>
	);
};
export default FieldDisplayWrapper;

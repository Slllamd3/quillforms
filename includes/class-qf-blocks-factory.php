<?php
/**
 * Blocks API: QF_Blocks_Factory class.
 *
 * @package QuillForms
 * @since 1.0.0
 */

/**
 * Core class used for interacting with block types.
 *
 * @since 1.0.0
 */
final class QF_Blocks_Factory {
	/**
	 * Registered block types, as `$name => $instance` pairs.
	 *
	 * @since 1.0.0
	 *
	 * @var QF_Block[]
	 */
	private $registered_block_types = array();

	/**
	 * Container for the main instance of the class.
	 *
	 * @since 1.0.0
	 *
	 * @var QF_Blocks_Factory|null
	 */
	private static $instance = null;

	/**
	 * Registers a block type.
	 *
	 * @since 1.0.0
	 *
	 * @param QF_Block $block QF_Block_Type instance.
	 *
	 * @return QF_Block the registered block type on success, or false on failure
	 */
	public function register( $block ) {
		$block_type = null;
		if ( ! $block instanceof QF_Block ) {
			$message = __( 'Registered Block must be instance of QF_BLOCK.', 'quillforms' );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		} else {
			$block_type = $block;
			$type       = $block_type->type;
		}

		if ( preg_match( '/[A-Z]+/', $type ) ) {
			$message = __( 'Block type names must not contain uppercase characters.', 'quillforms' );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		if ( $this->is_registered( $type ) ) {
			/* translators: %s: Block name. */
			$message = sprintf( __( 'Block type "%s" is already registered.', 'quillforms' ), $type );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		if ( ! $block_type ) {
			$block_type = new QF_Block( $type );
		}

		$this->registered_block_types[ $type ] = $block_type;

		return $block_type;
	}

	/**
	 * Unregisters a block type.
	 *
	 * @since 1.0.0
	 *
	 * @param string|QF_Block $type block type name including namespace, or alternatively a
	 *                              complete QF_Block instance.
	 *
	 * @return QF_Block|false the unregistered block type on success, or false on failure
	 */
	public function unregister( $type ) {
		if ( $type instanceof QF_Block ) {
			$type = $type->type;
		}

		if ( ! $this->is_registered( $type ) ) {
			/* translators: %s: Block name. */
			$message = sprintf( __( 'Block type "%s" is not registered.', 'quillforms' ), $type );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		$unregistered_block_type = $this->registered_block_types[ $type ];
		unset( $this->registered_block_types[ $type ] );

		return $unregistered_block_type;
	}

	/**
	 * Creates a block object from an array of field properties.
	 * This function will be used for fields only so we can access methods like validating, snaitizing, ...etc.
	 *
	 * @param array $properties The block properties.
	 *
	 * @return QF_Block|bool
	 */
	public function create( $properties ) {

		$type = isset( $properties['type'] ) ? $properties['type'] : '';

		if ( empty( $type ) || ! isset( $this->registered_block_types[ $type ] ) ) {
			$message = __( 'Block type is not defined.', 'quillforms' );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		$class      = $this->registered_block_types[ $type ];
		$class_name = get_class( $class );
		$block      = new $class_name( $properties );

		return $block;
	}

	/**
	 * Retrieves a registered block type.
	 *
	 * @since 1.0.0
	 *
	 * @param string $name block type name including namespace.
	 *
	 * @return QF_Block|null the registered block type, or null if it is not registered
	 */
	public function get_registered( $name ) {
		if ( ! $this->is_registered( $name ) ) {
			return null;
		}

		return $this->registered_block_types[ $name ];
	}

	/**
	 * Retrieves all registered block types.
	 *
	 * @since 1.0.0
	 *
	 * @return QF_Block[] associative array of `$block_type_name => $block_type` pairs
	 */
	public function get_all_registered() {
		return $this->registered_block_types;
	}

	/**
	 * Checks if a block type is registered.
	 *
	 * @since 1.0.0
	 *
	 * @param string $name block type name including namespace.
	 *
	 * @return bool true if the block type is registered, false otherwise
	 */
	public function is_registered( $name ) {
		return isset( $this->registered_block_types[ $name ] );
	}

	/**
	 * Utility method to retrieve the main instance of the class.
	 *
	 * The instance will be created if it does not exist yet.
	 *
	 * @since 1.0.0
	 *
	 * @return QF_Blocks_Factory the main instance
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}
